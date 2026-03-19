require("dotenv").config();
const { Client } = require("pg");

const DATABASE_URL = `postgresql://postgres:${process.env.ADMIN_PASSWORD || 'Adm63@F'}@db.ujfxydzaseqqcedxyqja.supabase.co:5432/postgres`;

(async () => {
  // Try direct connection with service key as password
  // Supabase pooler connection format
  const connStr = process.env.DATABASE_URL || DATABASE_URL;
  const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL!");
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS service_faq (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
        pergunta TEXT NOT NULL,
        resposta TEXT NOT NULL,
        ordem INT DEFAULT 0,
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log("Table service_faq created (or already exists)!");

    // Enable RLS
    await client.query(`ALTER TABLE service_faq ENABLE ROW LEVEL SECURITY;`).catch(() => {});
    
    // Create policies (ignore if already exist)
    await client.query(`
      DO $$ BEGIN
        CREATE POLICY "Leitura publica service_faq" ON service_faq FOR SELECT USING (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `).catch(() => {});
    
    await client.query(`
      DO $$ BEGIN
        CREATE POLICY "Escrita total service_faq" ON service_faq FOR ALL USING (auth.role() = 'service_role');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `).catch(() => {});
    
    console.log("RLS policies configured!");
    
    // Test query
    const { rows } = await client.query("SELECT COUNT(*) as c FROM service_faq");
    console.log("Table verified! Current rows:", rows[0].c);
    
  } catch (err) {
    console.error("Error:", err.message);
    if (err.message.includes("password authentication failed")) {
      console.log("\\nThe database password may differ from service key.");
      console.log("Please create the table manually in Supabase Dashboard > SQL Editor.");
    }
  } finally {
    await client.end();
  }
})();
