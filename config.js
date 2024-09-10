{
  "development"; {
    "username"; "root",
    "password"; null,
    "database"; "harmonia",
    "host"; "localhost",
    "dialect"; "mysql"
  }
  "test"; {
    "username"; "root",
    "password"; null,
    "database"; "database_test",
    "host"; "127.0.0.1",
    "dialect"; "mysql"
  }
  "production"; {
    "username"; process.env.DB_USER || "root",
    "password"; process.env.DB_PASSWORD || null,
    "database"; process.env.DB_NAME || "database_production",
    "host"; process.env.DB_HOST || "127.0.0.1",
    "dialect"; "mysql",
    "dialectOptions"; {
      "ssl"; {
        "rejectUnauthorized"; false
      }
    }
  }
}
