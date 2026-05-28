package main

import (
	"database/sql"
	"fmt"

	_ "github.com/jackc/pgx/v5/stdlib"
)

func main() {
	dbURL := "postgresql://postgres.iudkexocalqdhxuyjacu:Longlong123%40a@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"
	db, err := sql.Open("pgx", dbURL)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	queries := []string{
		`DROP TABLE IF EXISTS companies CASCADE;`,
		`CREATE TABLE companies (
			id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
			tax_code text NOT NULL,
			name text NOT NULL,
			short_name text,
			address text NOT NULL,
			phone text NOT NULL,
			email text NOT NULL,
			logo_url text,
			representative_name text NOT NULL,
			business_license_url text[],
			mission text,
			vision text,
			status text DEFAULT 'active',
			created_at timestamp with time zone DEFAULT now(),
			updated_at timestamp with time zone DEFAULT now(),
			deleted_at timestamp with time zone
		);`,
		`ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS company_id uuid NULL REFERENCES companies(id);`,
	}

	for _, q := range queries {
		_, err := db.Exec(q)
		if err != nil {
			fmt.Printf("Error executing query: %v\n", err)
			return
		}
	}
	fmt.Println("Migration successful!")
}
