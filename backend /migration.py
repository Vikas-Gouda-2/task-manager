import sqlite3

def run_migration():
    """Adds 'category' and 'due_date' columns to the tasks table if they don't exist."""
    print("Running migration to add 'category' and 'due_date' columns...")
    try:
        conn = sqlite3.connect("tasks.db")
        cursor = conn.cursor()
        
        # Check existing columns
        cursor.execute("PRAGMA table_info(tasks)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if "category" not in columns:
            cursor.execute("ALTER TABLE tasks ADD COLUMN category VARCHAR")
            print("- Added 'category' column.")
            
        if "due_date" not in columns:
            cursor.execute("ALTER TABLE tasks ADD COLUMN due_date DATE")
            print("- Added 'due_date' column.")
            
        conn.commit()
        print("Migration complete.")
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    run_migration()
