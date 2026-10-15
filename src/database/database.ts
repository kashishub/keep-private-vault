
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

    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY NOT NULL,
      folder_id TEXT NOT NULL,
      name TEXT NOT NULL,
      file_uri TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (folder_id) REFERENCES folders(id)
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


export type VaultPhoto = {
  id: string;
  folderId: string;
  name: string;
  fileUri: string;
  createdAt: string;
};

export async function getPhotos(folderId: string): Promise<VaultPhoto[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<{
    id: string;
    folder_id: string;
    name: string;
    file_uri: string;
    created_at: string;
  }>(
    `SELECT id, folder_id, name, file_uri, created_at
     FROM photos
     WHERE folder_id = ?
     ORDER BY created_at DESC;`,
    folderId
  );

  return rows.map((row) => ({
    id: row.id,
    folderId: row.folder_id,
    name: row.name,
    fileUri: row.file_uri,
    createdAt: row.created_at,
  }));
}

export async function savePhoto(
  folderId: string,
  name: string,
  fileUri: string
): Promise<VaultPhoto> {
  const db = await getDatabase();

  const photo: VaultPhoto = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    folderId,
    name,
    fileUri,
    createdAt: new Date().toISOString(),
  };

  await db.runAsync(
    `INSERT INTO photos (id, folder_id, name, file_uri, created_at)
     VALUES (?, ?, ?, ?, ?);`,
    photo.id,
    photo.folderId,
    photo.name,
    photo.fileUri,
    photo.createdAt
  );

  return photo;
}

export async function deletePhoto(photoId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM photos WHERE id = ?;', photoId);
}
