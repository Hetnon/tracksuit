import { Database } from "@db/sqlite";

export const createTable = `
  CREATE TABLE IF NOT EXISTS insights (
    id INTEGER PRIMARY KEY ASC NOT NULL,
    brand INTEGER NOT NULL,
    createdAt TEXT NOT NULL,
    text TEXT NOT NULL
  )
`;

export const ensureTable = (db: Database) => {
  try {
    db.exec(createTable);
  } catch (error) {
    console.error("Error creating insights table:", error);
  }
};

// is brand really a number? - if so, do we have a table for brands? and should it be a foreign key in this case?
// 'text' deserved a better name, like "insightDescription" or something similar

export type Row = {
  id: number;
  brand: number;
  createdAt: string;
  text: string;
};

export type Insert = {
  brand: number;
  createdAt: string;
  text: string;
};

export const insertStatement = (item: Insert) =>
  `INSERT INTO insights (brand, createdAt, text) VALUES (${item.brand}, '${item.createdAt}', '${item.text}')`;
