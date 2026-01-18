#!/bin/bash

# Path to the database
DB_PATH="db.sqlite"

# Check if sqlite3 is installed
if ! command -v sqlite3 &> /dev/null; then
    echo "Error: sqlite3 is not installed. Please install it first."
    exit 1
fi

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    echo "Error: Database file not found at $DB_PATH"
    echo "Make sure you are running this script from the 'system/' directory."
    exit 1
fi

echo "=============================================="
echo "   Sto. Niño Portal Admin CLI Setup"
echo "=============================================="

# Check for existing admin
# We look for role = 'ADMIN'
ADMIN_INFO=$(sqlite3 "$DB_PATH" "SELECT email, name FROM users WHERE role = 'ADMIN' LIMIT 1;")

if [ -n "$ADMIN_INFO" ]; then
    EMAIL=$(echo "$ADMIN_INFO" | cut -d'|' -f1)
    NAME=$(echo "$ADMIN_INFO" | cut -d'|' -f2)
    
    echo "Found existing Administrator account:"
    echo "----------------------------------------------"
    echo "Name:  $NAME"
    echo "Email: $EMAIL"
    echo "----------------------------------------------"
    echo ""
    echo "What would you like to do?"
    echo "1) Ignore (Exit)"
    echo "2) Forgot Password (Reset Admin Password)"
    
    read -p "Select an option [1-2]: " CHOICE
    
    case $CHOICE in
        2)
            echo ""
            read -s -p "Enter new password for $EMAIL: " NEW_PASS
            echo ""
            read -s -p "Confirm new password: " CONFIRM_PASS
            echo ""
            
            if [ "$NEW_PASS" == "$CONFIRM_PASS" ]; then
                sqlite3 "$DB_PATH" "UPDATE users SET password='$NEW_PASS' WHERE email='$EMAIL' AND role='ADMIN';"
                echo "Success: Password has been updated."
            else
                echo "Error: Passwords do not match. No changes made."
            fi
            ;;
        *)
            echo "Exiting setup..."
            exit 0
            ;;
    esac
else
    echo "No Administrator account found in the database."
    echo "Let's create a new one."
    echo ""
    read -p "Full Name: " ADMIN_NAME
    read -p "Email Address: " ADMIN_EMAIL
    read -s -p "Password: " ADMIN_PASS
    echo ""
    
    # Simple validation
    if [[ -z "$ADMIN_NAME" || -z "$ADMIN_EMAIL" || -z "$ADMIN_PASS" ]]; then
        echo "Error: All fields are required."
        exit 1
    fi
    
    ADMIN_ID="u-admin-$(date +%s)"
    
    # Insert the admin user
    # Note: emailVerified = 1, status = 'active', role = 'ADMIN'
    INSERT_SQL="INSERT INTO users (id, name, email, password, role, emailVerified, status) VALUES ('$ADMIN_ID', '$ADMIN_NAME', '$ADMIN_EMAIL', '$ADMIN_PASS', 'ADMIN', 1, 'active');"
    
    sqlite3 "$DB_PATH" "$INSERT_SQL"
    
    if [ $? -eq 0 ]; then
        echo "Success: Administrator account created successfully!"
        echo "You can now log in with $ADMIN_EMAIL"
    else
        echo "Error: Failed to insert user. The email might already be taken."
    fi
fi
