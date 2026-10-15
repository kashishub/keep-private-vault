
import * as SQLite from 'expo-sqlite';

export type VaultFolder = {
  id: string;
  name: string;
  createdAt: string;
  protected: boolean;
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync('keep.db');
  }

  return databasePromise;
}

export async function initializeDatabase(): Promise<void> {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS folders (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      protected INTEGER NOT NULL DEFAULT 1
    );
  `);
}

export async function getFolders(): Promise<VaultFolder[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<{
    id: string;
    name: string;
    created_at: string;
    protected: number;
  }>(
    `SELECT id, name, created_at, protected
     FROM folders
     ORDER BY created_at DESC;`,
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    protected: row.protected === 1,
  }));
}

export async function createFolder(name: string): Promise<VaultFolder> {
  const db = await getDatabase();
  const folder: VaultFolder = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    name: name.trim(),
    createdAt: new Date().toISOString(),
    protected: true,
  };

  await db.runAsync(
    `INSERT INTO folders (id, name, created_at, protected)
     VALUES (?, ?, ?, ?);`,
    folder.id,
    folder.name,
    folder.createdAt,
    folder.protected ? 1 : 0,
  );

  return folder;
}

export async function renameFolder(
  id: string,
  name: string,
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    'UPDATE folders SET name = ? WHERE id = ?;',
    name.trim(),
    id,
  );
}

export async function deleteFolder(id: string): Promise<void> {
  const db = await getDatabase();

  await db.runAsync('DELETE FROM folders WHERE id = ?;', id);
}
