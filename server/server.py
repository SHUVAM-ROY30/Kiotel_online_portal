from ssl import SSLError
from flask import Flask, request, jsonify, session, Response
from flask_cors import CORS
import pymysql
import json
from functools import wraps
from flask import redirect, url_for
import datetime
from models import db, Ticket
import os
from flask import send_from_directory
import traceback


import hashlib
import uuid

# from werkzeug.utils import secure_filename
# from flask_mail import Mail, Message
import smtplib, ssl
from email.mime.multipart import MIMEMultipart  # Add this import
from email.mime.text import MIMEText  # Add this import
from email.mime.base import MIMEBase  # Add this import
from email import encoders  # Add this for encoding attachments
# from flask_mail import Mail, Message







app = Flask(__name__)
CORS(app, supports_credentials=True)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Configure the session
app.config["SECRET_KEY"] = "abcdefghijklmnopqrstuvwxyz"
app.config["SESSION_TYPE"] = "filesystem"

# Directory for saving uploads
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the upload directory exists
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER








def create_connection():
    try:
        connection = pymysql.connect(
            host="64.227.6.9",  # Replace with the public IP address of your VPS
            user="kshiti",  # Replace with your MySQL user
            password="Kiotel123!",  # Replace with your MySQL password
            database="kiotel",  # Replace with your database name
            cursorclass=pymysql.cursors.DictCursor
        )
        print("Successfully connected to the database")
        return connection
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return None


def create_connection2():
    try:
        connection = pymysql.connect(
            host="64.227.6.9",
            user="kshiti",
            password="Kiotel123!",
            database="Kiotel_Hr",  # Second DB
            cursorclass=pymysql.cursors.DictCursor
        )
        print("Successfully connected to the secondary database")
        return connection
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred in secondary DB")
        return None

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("login_user"))
        return f(*args, **kwargs)
    return decorated_function



# @app.route("/api/signin", methods=["POST"])
# def login_user():
#     email = request.json.get("email")
#     password = request.json.get("password")

#     if not email or not password:
#         return jsonify({"error": "Email and password are required"}), 400

#     connection = create_connection()
#     if connection is None:
#         return jsonify({"error": "Failed to connect to the database"}), 500

#     try:
#         with connection.cursor(pymysql.cursors.DictCursor) as cursor:
#             cursor.callproc('Proc_tblUsers_CheckCredentials', (email, password, 0))
#             cursor.execute("SELECT @_Proc_tblUsers_CheckCredentials_2")
#             result = cursor.fetchone()
#             credentials_valid = result.get('@_Proc_tblUsers_CheckCredentials_2')

#             if credentials_valid == 1:
#                 cursor.execute("SELECT * FROM tblusers WHERE emailid = %s", (email,))
#                 user = cursor.fetchone()
#                 session["user_id"] = user['id']
#                 session.permanent = True  # Make the session permanent (cookie won't be deleted after the browser is closed)
#                 return jsonify({
#                     "id": user['id'],
#                     "email": user['emailid']
#                 })
#             else:
#                 return jsonify({"error": "Unauthorized"}), 401
#     except pymysql.MySQLError as e:
#         print(f"The error '{e}' occurred")
#         return jsonify({"error": "Database query failed"}), 500
#     finally:
#         connection.close()



@app.route("/api/signin", methods=["POST"])
def login_user():
    email = request.json.get("email")
    password = request.json.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Call stored procedure to check credentials
            cursor.callproc('Proc_tblUsers_CheckCredentials', (email, password, 0))
            cursor.execute("SELECT @_Proc_tblUsers_CheckCredentials_2 AS result")
            result = cursor.fetchone()
            credentials_valid = result['result']

            if credentials_valid == 1:
                # Fetch user data including account_no
                cursor.execute("SELECT * FROM tblusers WHERE emailid = %s", (email,))
                user = cursor.fetchone()

                if not user:
                    return jsonify({"error": "User not found"}), 404

                # Save user_id to session
                session["user_id"] = user['id']
                session.permanent = True  # Make session persistent

                # Return user data including account_no
                return jsonify({
                    "id": user['id'],
                    "email": user['emailid'],
                    "account_no": user['account_no']  # 👈 Added account_no
                })
            else:
                return jsonify({"error": "Unauthorized"}), 401
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    finally:
        connection.close()


@app.route("/api/user-email", methods=["GET"])
@login_required
def get_user_email():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT * FROM tblusers WHERE id = %s", (user_id,))
            user = cursor.fetchone()
            if user:
                return jsonify({"fname": user['fname'],"lname": user['lname'], "role": user["role_id"],"email": user['emailid'],"id": user['id']})
            else:
                return jsonify({"error": "User not found"}), 404
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    finally:
        connection.close()





# @app.route("/api/register", methods=["POST"])
# def register_user():
#     data = request.json
#     email = data["email"]
#     password = data["password"]
#     fname = data.get("fname")
#     lname = data.get("lname")
#     dob = data.get("dob")
#     address = data.get("address")
#     address2 = data.get("address2")
#     entity_name = data.get("entity_name")
#     account_no = data.get("account_no")
#     account_no2 = data.get("account_no2")
#     mobileno = data.get("mobileno")
#     role_id = int(data.get("role_id", 2))  # 👈 Convert to int here

#     connection1 = create_connection()
#     if not connection1:
#         return jsonify({"error": "Failed to connect to primary database"}), 500

#     connection2 = create_connection2() if role_id in (1, 2, 3) else None

#     try:
#         with connection1.cursor() as cursor1:
#             # Check existing user
#             cursor1.execute("SELECT id FROM tblusers WHERE emailid = %s OR account_no = %s", (email, account_no))
#             existing_user = cursor1.fetchone()
#             if existing_user:
#                 return jsonify({"message": "Email or Account Number already exists"}), 409

#             # Insert into primary DB
#             user_id = 0
#             cursor1.callproc('Proc_tblusers_Upsert', (
#                 user_id, email, password, fname, lname, dob, address, account_no, mobileno, role_id
#             ))
#             connection1.commit()

#             cursor1.execute("SELECT * FROM tblusers WHERE emailid = %s", (email,))
#             user = cursor1.fetchone()

#             # Only proceed if role_id is 1, 2, or 3
#             if connection2:
#                 with connection2.cursor() as cursor2:
#                     if role_id == 1:
#                         # Insert into admins table
#                         cursor2.execute("""
#                             INSERT INTO admins (unique_id, first_name, last_name)
#                             VALUES (%s, %s, %s)
#                         """, (account_no, fname, lname))

#                     elif role_id in (2, 3):
#                         # Insert into employees table
#                         cursor2.execute("""
#                             INSERT INTO employees_test (
#                                 unique_id,
#                                 first_name,
#                                 last_name,
#                                 email,
#                                 date_of_joining,
#                                 annual_leave,
#                                 sick_leave,
#                                 casual_leave,
#                                 other_leave
#                             ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
#                         """, (
#                             account_no, fname, lname, email, dob, 0, 0, 0, 0
#                         ))

#                     connection2.commit()

            

#             return jsonify({
#                 "id": user['id'],
#                 "email": user['emailid'],
#                 "message": "User registered successfully"
#             })

#     except pymysql.MySQLError as e:
#         connection1.rollback()
#         if connection2:
#             connection2.rollback()
#         print(f"Database error: {e}")
#         return jsonify({"error": "Registration failed due to database error"}), 500

#     finally:
#         connection1.close()
#         if connection2:
#             connection2.close()




@app.route("/api/register", methods=["POST"])
def register_user():
    data = request.json

    # Required fields
    email = data.get("email")
    password = data.get("password")

    # Optional fields with 'N/A' defaults
    fname = data.get("fname", "N/A")
    lname = data.get("lname", "N/A")
    dob = data.get("dob", "0000-00-00")
    address = data.get("address", "N/A")
    address2 = data.get("address2", "N/A")
    entity_name = data.get("entity_name", "N/A")
    account_no = data.get("account_no", "N/A")
    account_no2 = data.get("account_no2", "N/A")
    mobileno = data.get("mobileno", "N/A")
    role_id = int(data.get("role_id", 2))  # Default to 2 if not provided

    # --- NEW: Handle Group IDs ---
    # Expecting a list of integers, e.g., [1, 3, 5] or an empty list []
    group_ids_list = data.get("group_ids", [])
    # Convert list of integers to a comma-separated string for the SP
    # Handle cases where the list might be empty or contain invalid data
    if isinstance(group_ids_list, list):
        # Filter out non-integer items and convert to string
        try:
            group_ids_filtered = [str(gid) for gid in group_ids_list if isinstance(gid, int)]
        except (ValueError, TypeError):
            group_ids_filtered = []
        group_ids_string = ','.join(group_ids_filtered)
    else:
        # If group_ids is not a list, treat as no groups
        group_ids_string = ''

    # --- END NEW ---

    connection1 = create_connection()
    if not connection1:
        return jsonify({"error": "Failed to connect to primary database"}), 500

    connection2 = create_connection2() if role_id in (1, 2, 3) else None

    try:
        # Use a DictCursor to easily access results by column name
        with connection1.cursor(pymysql.cursors.DictCursor) as cursor1:
            # Check existing user
            cursor1.execute("SELECT id FROM tblusers WHERE emailid = %s OR account_no = %s", (email, account_no))
            existing_user = cursor1.fetchone()
            if existing_user:
                return jsonify({"message": "Email or Account Number already exists"}), 409

            # --- UPDATED: Call the new stored procedure with group IDs ---
            # Prepare the call. sp_manage_user_with_groups expects user fields and the group_ids string.
            # It handles insertion and returns the new user's ID via SELECT LAST_INSERT_ID().
            cursor1.callproc('sp_manage_user_with_groups', (
                0,  # p_id = 0 for new user
                email, password, fname, lname, dob, address, address2,
                entity_name, account_no, account_no2, mobileno, role_id,
                group_ids_string # p_group_ids
            ))
            connection1.commit()

            # --- Fetch the ID of the newly inserted user ---
            # The stored procedure inserts the user and manages groups.
            # We need the user ID for secondary DB operations.
            # Option 1: Fetch immediately after the commit using LAST_INSERT_ID()
            cursor1.execute("SELECT LAST_INSERT_ID() AS new_user_id;")
            result = cursor1.fetchone()
            new_user_id = result['new_user_id'] if result and result['new_user_id'] else None

            if not new_user_id:
                 # Fallback: Select user by email to get ID (less efficient)
                 cursor1.execute("SELECT id FROM tblusers WHERE emailid = %s", (email,))
                 user_result = cursor1.fetchone()
                 new_user_id = user_result['id'] if user_result else None

            if not new_user_id:
                raise Exception("Could not retrieve the ID of the newly created user.")

            # Fetch the full user record using the obtained ID
            cursor1.execute("SELECT * FROM tblusers WHERE id = %s", (new_user_id,))
            user = cursor1.fetchone()
            # --- END UPDATED ---

        # Handle secondary DB insertion only for roles 1, 2, 3
        if connection2:
            with connection2.cursor() as cursor2:
                if role_id == 1:
                    # Insert into admins table
                    cursor2.execute("""
                        INSERT INTO admins (unique_id, first_name, last_name)
                        VALUES (%s, %s, %s)
                    """, (account_no, fname, lname))

                elif role_id in (2, 3):
                    # Insert into employees_test table (assuming 'employees' based on previous code)
                    cursor2.execute("""
                        INSERT INTO employees (
                            unique_id,
                            first_name,
                            last_name,
                            email,
                            date_of_joining,
                            annual_leave,
                            sick_leave,
                            casual_leave,
                            other_leave
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        account_no, fname, lname, email, dob, 0, 0, 0, 0
                    ))

                connection2.commit()

        return jsonify({
            "id": user['id'], # Use the ID fetched from the database
            "email": user['emailid'],
            "message": "User registered and groups assigned successfully"
        }), 201 # 201 Created is more appropriate for successful creation

    except pymysql.MySQLError as e:
        connection1.rollback()
        if connection2:
            connection2.rollback()
        print(f"Database error: {e}")
        # Provide a more specific error message if possible
        return jsonify({"error": f"Registration failed due to a database error: {str(e)}"}), 500
    except Exception as e: # Catch other potential errors (e.g., user ID retrieval)
        connection1.rollback()
        if connection2:
            connection2.rollback()
        print(f"Error during registration: {e}")
        return jsonify({"error": f"Registration process failed: {str(e)}"}), 500

    finally:
        connection1.close()
        if connection2:
            connection2.close()


# @app.route("/api/register", methods=["POST"])
# def register_user():
#     data = request.json

#     # Required fields
#     email = data.get("email")
#     password = data.get("password")

#     # Optional fields with 'N/A' defaults
#     fname = data.get("fname", "N/A")
#     lname = data.get("lname", "N/A")
#     dob = data.get("dob", "0000-00-00")
#     address = data.get("address", "N/A")
#     address2 = data.get("address2", "N/A")
#     entity_name = data.get("entity_name", "N/A")
#     account_no = data.get("account_no", "N/A")
#     account_no2 = data.get("account_no2", "N/A")
#     mobileno = data.get("mobileno", "N/A")
#     role_id = int(data.get("role_id", 2))  # Default to 2 if not provided

#     connection1 = create_connection()
#     if not connection1:
#         return jsonify({"error": "Failed to connect to primary database"}), 500

#     connection2 = create_connection2() if role_id in (1, 2, 3) else None

#     try:
#         with connection1.cursor() as cursor1:
#             # Check existing user
#             cursor1.execute("SELECT id FROM tblusers WHERE emailid = %s OR account_no = %s", (email, account_no))
#             existing_user = cursor1.fetchone()
#             if existing_user:
#                 return jsonify({"message": "Email or Account Number already exists"}), 409

#             # Insert into primary DB using the stored procedure
#             user_id = 0  # Assuming upsert handles insert when user_id = 0
#             cursor1.callproc('Proc_tblusers_Upsert_V2', (
#                 user_id, email, password, fname, lname, dob, address, address2,
#                 entity_name, account_no, account_no2, mobileno, role_id
#             ))
#             connection1.commit()

#             # Fetch inserted user
#             cursor1.execute("SELECT * FROM tblusers WHERE emailid = %s", (email,))
#             user = cursor1.fetchone()

#         # Handle secondary DB insertion only for roles 1, 2, 3
#         if connection2:
#             with connection2.cursor() as cursor2:
#                 if role_id == 1:
#                     # Insert into admins table
#                     cursor2.execute("""
#                         INSERT INTO admins (unique_id, first_name, last_name)
#                         VALUES (%s, %s, %s)
#                     """, (account_no, fname, lname))

#                 elif role_id in (2, 3):
#                     # Insert into employees_test table
#                     cursor2.execute("""
#                         INSERT INTO employees (
#                             unique_id,
#                             first_name,
#                             last_name,
#                             email,
#                             date_of_joining,
#                             annual_leave,
#                             sick_leave,
#                             casual_leave,
#                             other_leave
#                         ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
#                     """, (
#                         account_no, fname, lname, email, dob, 0, 0, 0, 0
#                     ))

#                 connection2.commit()

#         return jsonify({
#             "id": user['id'],
#             "email": user['emailid'],
#             "message": "User registered successfully"
#         })

#     except pymysql.MySQLError as e:
#         connection1.rollback()
#         if connection2:
#             connection2.rollback()
#         print(f"Database error: {e}")
#         return jsonify({"error": "Registration failed due to database error"}), 500

#     finally:
#         connection1.close()
#         if connection2:
#             connection2.close()


# Assuming you have necessary imports like jsonify, create_connection, etc.

@app.route('/api/groups', methods=['GET'])
def get_groups():
    """API endpoint to fetch all groups."""
    connection = create_connection() # Use your existing connection function
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, name FROM tblgroups ORDER BY name")
            groups = cursor.fetchall()
        return jsonify(groups), 200
    except Exception as e:
        print(f"Error fetching groups: {e}")
        return jsonify({"error": "Failed to fetch groups"}), 500
    finally:
        connection.close()

# Ensure your /api/register endpoint (from previous conversation) handles the 'group_ids' list.
# It should expect a key like 'group_ids' in the request JSON with a value like [1, 3, 5].





@app.route("/Dashboard")
@login_required
def dashboard():
    return "Welcome to the Dashboard!"

# New added after sending ZIP file to kshiti

@app.route("/api/opened_tickets", methods=["GET"])
@login_required
def get_opened_tickets():
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Call the stored procedure
            cursor.callproc("Proc_tbltickets_DisplayOpenedtickets")
            
            # Fetch the result
            opened_tickets = cursor.fetchall()
            
            # Print raw result for debugging
            # print("Raw result:", opened_tickets)

            # Decode bytes fields to strings, if any
            for ticket in opened_tickets:
                for key, value in ticket.items():
                    if isinstance(value, bytes):
                        ticket[key] = value.decode("utf-8")

            return jsonify(opened_tickets), 200
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        connection.close()







@app.route("/api/latest_opened_tickets", methods=["GET"])
@login_required
def get_latest_opened_tickets():
    user_id = session.get("user_id")
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Call the stored procedure for the latest 5 opened tickets
            cursor.callproc("Proc_tbltickets_SelectAssignedTicketsOfUser", (user_id))
            
            # Fetch the result
            latest_opened_tickets = cursor.fetchall()
            
            # Print raw result for debugging
            # print("Raw result:", latest_opened_tickets)
            # Decode bytes fields to strings, if any
            for ticket in latest_opened_tickets:
                for key, value in ticket.items():
                    if isinstance(value, bytes):
                        ticket[key] = value.decode("utf-8")

            return jsonify(latest_opened_tickets), 200
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        connection.close()


@app.route("/api/latestclosed", methods=["GET"])
@login_required
def get_latest_closed_tickets():
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            cursor.callproc("Proc_tbltickets_DisplayTop5Closedtickets")
            result = cursor.fetchall()

            for ticket in result:
                for key, value in ticket.items():
                    if isinstance(value, bytes):
                        ticket[key] = value.decode("utf-8")

                if 'attachments' in ticket and isinstance(ticket['attachments'], str):
                    ticket['attachments'] = json.loads(ticket['attachments'])

            return jsonify(result), 200
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        connection.close()



@app.route("/api/closed_tickets", methods=["GET"])
@login_required
def get_closed_tickets():
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Call the stored procedure for closed tickets
            cursor.callproc("Proc_tbltickets_DisplayClosedtickets")
            
            # Fetch the result
            closed_tickets = cursor.fetchall()
            
            # Print raw result for debugging
            # print("Raw result:", closed_tickets)

            # Decode bytes fields to strings, if any
            for ticket in closed_tickets:
                for key, value in ticket.items():
                    if isinstance(value, bytes):
                        ticket[key] = value.decode("utf-8")

            return jsonify(closed_tickets), 200
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        connection.close()





#----------------------------------------------------------------------------------------------------------

def generate_unique_name(filename):
    # You can generate a unique name based on the original filename and some random string (e.g., UUID)
    unique_str = str(uuid.uuid4())  # Generate a UUID
    _, ext = os.path.splitext(filename)  # Extract the file extension
    unique_name = hashlib.sha256(unique_str.encode()).hexdigest() + ext  # Encrypt the UUID and append the extension
    return unique_name

#----------------------------------------------------------------------------------------------------------


@app.route("/api/ticket", methods=["POST"])
def create_ticket():
    user_id = session.get("user_id")
    
    if user_id is None:
        return jsonify({"error": "User ID not found in session"}), 400

    title = request.form.get("title")
    description = request.form.get("description")
    attachments = request.files.getlist("attachments")

    if not title or not description:
        return jsonify({"error": "Title and description are required"}), 400

    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        attachment_filenames = []
        upload_folder = app.config['UPLOAD_FOLDER']

        with connection.cursor() as cursor:
            # Save attachments if any
            if attachments:
                for attachment in attachments:
                    original_filename = attachment.filename
                    file_path = os.path.join(upload_folder, original_filename)
                    attachment.save(file_path)
                    attachment_filenames.append(original_filename)

            attachments_json = json.dumps(attachment_filenames)

            cursor.execute("SET @current_user_id = %s", (user_id,))

            # Set status_id to 1 (assumed 'Open' status)
            status_id = 1

            cursor.callproc('Proc_tbltickets_UpsertTicket', (0, title, description, attachments_json, None, status_id))
            connection.commit()

            cursor.execute("SELECT LAST_INSERT_ID() AS ticket_id")
            ticket_id = cursor.fetchone()["ticket_id"]

            # Fetch creator's email
            cursor.execute("SELECT emailid FROM tblusers WHERE id = %s", (user_id,))
            creator_email = cursor.fetchone()["emailid"]

            # Fetch emails of users with roleid as 3
            cursor.execute("SELECT emailid FROM tblusers WHERE role_id = 3 AND IFNULL(IsDeleted, 0) = 0;")
            role_3_emails = [row["emailid"] for row in cursor.fetchall()]

            # Send email notification
            # send_email_notification(title, description, ticket_id, [creator_email] + role_3_emails)

            return jsonify({"message": "Ticket created successfully", "ticket_id": ticket_id}), 201
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()


# Function to send email notification
def send_email_notification(title, description, ticket_id, recipient_emails):
    try:


        # Create the email message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = ', '.join(recipient_emails)
        msg['Subject'] = "New Ticket Created"

        # Add body text
        body = f"New Ticket Created\n\nTicket ID: {ticket_id}\nTitle: {title}\nDescription: {description}"
        msg.attach(MIMEText(body, 'plain'))

        # Create secure connection with server and send the email
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_server, port) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(sender_email, password)
            server.sendmail(sender_email, recipient_emails, msg.as_string())

        print("Email sent successfully to all recipients")
    except Exception as e:
        print(f"Email sending failed: {e}")











@app.route("/api/tickets/<int:ticket_id>", methods=["GET"])
@login_required
def get_ticket(ticket_id):
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.callproc("Proc_tbltickets_DisplayticketsById", (ticket_id,))
            result = cursor.fetchall()

            # Debugging: Print result for verification
            # print("Query Result:", result)

            if not result:
                return jsonify({"error": "Ticket not found"}), 404

            ticket = result[0]

            for key, value in ticket.items():
                if isinstance(value, bytes):
                    ticket[key] = value.decode("utf-8")

            if 'attachments' in ticket and isinstance(ticket['attachments'], str):
                ticket['attachments'] = json.loads(ticket['attachments'])

            return jsonify(ticket), 200
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        connection.close()


@app.route("/api/forms_ThirdPartyEquipment/<int:ticket_id>", methods=["GET"])
@login_required
def get_form_ThirdPartyEquipment(ticket_id):
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.callproc("Proc_tblthirdpartyequipment_selectcreatedby", (ticket_id,))
            result = cursor.fetchall()

            # Debugging: Print result for verification
            # print("Query Result:", result)

            if not result:
                return jsonify({"error": "Ticket not found"}), 404

            ticket = result[0]

            for key, value in ticket.items():
                if isinstance(value, bytes):
                    ticket[key] = value.decode("utf-8")

            if 'attachments' in ticket and isinstance(ticket['attachments'], str):
                ticket['attachments'] = json.loads(ticket['attachments'])

            return jsonify(ticket), 200
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        connection.close()


@app.route("/api/forms_PropertyOnBoardingForm/<int:ticket_id>", methods=["GET"])
@login_required
def get_form_PropertyOnBoardingForm(ticket_id):
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.callproc("Proc_tblhotelinformation_selectcreatedby", (ticket_id,))
            result = cursor.fetchall()

            # Debugging: Print result for verification
            # print("Query Result:", result)

            if not result:
                return jsonify({"error": "Ticket not found"}), 404

            ticket = result[0]

            for key, value in ticket.items():
                if isinstance(value, bytes):
                    ticket[key] = value.decode("utf-8")

            if 'attachments' in ticket and isinstance(ticket['attachments'], str):
                ticket['attachments'] = json.loads(ticket['attachments'])

            return jsonify(ticket), 200
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        connection.close()





# Route for serving files from the 'uploads' folder
@app.route('/uploads/<filename>', methods=['GET'])
def uploaded_file(filename):
    try:
        # Use send_from_directory to serve the file from the uploads folder
        return send_from_directory(UPLOAD_FOLDER, filename)
    except FileNotFoundError:
        # Return a 404 error if the file does not exist
        abort(404, description=f"File '{filename}' not found in the 'uploads' folder.")

# Route for serving files from the 'uploads/replies' subdirectory
@app.route('/uploads/replies/<filename>', methods=['GET'])
def uploaded_reply_file(filename):
    replies_folder = os.path.join(UPLOAD_FOLDER, 'replies')
    
    # Ensure the replies folder exists, otherwise create it
    if not os.path.exists(replies_folder):
        os.makedirs(replies_folder)
    
    try:
        # Use send_from_directory to serve the file from the replies folder
        return send_from_directory(replies_folder, filename)
    except FileNotFoundError:
        # Return a 404 error if the file does not exist
        abort(404, description=f"File '{filename}' not found in the 'uploads/replies' folder.")



@app.route('/api/status', methods=['GET'])
def get_status():
    conn = create_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.callproc('Proc_tblstatus_Selectstatusfordropdown')
            status_options = cursor.fetchall()
            
            # Print raw result for debugging
            # print("Raw result:", status_options)

            return jsonify(status_options), 200

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        conn.close()


@app.route('/api/roles', methods=['GET'])
def get_roles():
    conn = create_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.callproc('Proc_tblrole_selectrolefordropdown')
            roles_options = cursor.fetchall()
            
            # Print raw result for debugging
            # print("Raw result:", roles_options)

            return jsonify(roles_options), 200

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        conn.close()




# By kshiti





@app.route("/api/tickets/<int:ticket_id>/reply", methods=["POST"])
def reply_to_ticket(ticket_id):
    print(f"Received request for ticket ID: {ticket_id}")
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        description = request.form.get("description")
        status_id = int(request.form.get("status_id", 1))  # Convert to integer and default to 1 if missing

        # Fetch user_id from the session
        user_id = session.get('user_id')
        if user_id is None:
            return jsonify({"error": "User not logged in"}), 401

        # Process attachments
        attachments = request.files.getlist("attachments")
        original_filenames = []
        unique_names = []
        upload_folder = 'uploads/replies'
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        for file in attachments:
            if file:
                original_filename = file.filename
                unique_name = generate_unique_name(original_filename)
                file_path = os.path.join(upload_folder, unique_name)
                file.save(file_path)
                # Store only the original filename
                original_filenames.append(original_filename)
                unique_names.append(unique_name)

        # Convert the list of original filenames to a JSON string
        attachment_json = json.dumps(original_filenames)

        with connection.cursor() as cursor:
            # Call stored procedure to insert or update reply
            cursor.callproc('Proc_tblreplies_UpsertReply', [
                0,  # Assuming 0 means a new reply, adjust if necessary
                ticket_id,
                description,
                user_id,
                status_id,
                attachment_json,
                unique_names[0] if unique_names else None  # Include the unique name of the first attachment if any
            ])
            connection.commit()

            # Fetch email address of the ticket creator
            cursor.execute("SELECT emailid FROM tblusers WHERE id = (SELECT created_by FROM tbltickets WHERE id = %s)", (ticket_id,))
            creator_email_result = cursor.fetchone()
            creator_email = creator_email_result["emailid"] if creator_email_result else None

            # Fetch email address of the replier
            cursor.execute("SELECT emailid FROM tblusers WHERE id = %s", (user_id,))
            replier_email_result = cursor.fetchone()
            replier_email = replier_email_result["emailid"] if replier_email_result else None

            if creator_email and replier_email:
                # Send email notification to both creator and replier
                send_email_notification_reply(ticket_id, description, creator_email, replier_email)

        return jsonify({"message": "Reply submitted successfully"}), 201

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

# Function to send email notification to ticket creator and replier
def send_email_notification_reply(ticket_id, description, creator_email, replier_email):
    try:

        # Create the email message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = creator_email  # Set ticket creator's email as main recipient
        msg['Cc'] = replier_email  # Set replier's email in CC
        msg['Subject'] = f"New Reply Submitted for Ticket ID {ticket_id}"

        # Add body text
        body = f"A new reply has been added to Ticket ID: {ticket_id}.\n\nDescription: {description}"
        msg.attach(MIMEText(body, 'plain'))

        # Create secure connection with server and send the email
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_server, port) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(sender_email, password)
            server.sendmail(sender_email, [creator_email, replier_email], msg.as_string())

        print("Email sent successfully to both ticket creator and replier")
    except Exception as e:
        print(f"Email sending failed: {e}")




@app.route("/api/ticket/<int:ticket_id>/replies", methods=["GET"])
@login_required
def get_replies_by_ticket_id(ticket_id):
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.callproc("Proc_tblreplies_SelectRepliesByTicketId", (ticket_id,))
            replies = cursor.fetchall()
            # print("Query Result:", replies)

            # Decode bytes fields to strings, if any
            for reply in replies:
                for key, value in reply.items():
                    if isinstance(value, bytes):
                        reply[key] = value.decode("utf-8")

            return jsonify(replies), 200
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    finally:
        connection.close()


@app.route("/api/tickets/<int:ticket_id>/title", methods=["GET"])
def get_ticket_title(ticket_id):
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT title FROM tbltickets WHERE id = %s", (ticket_id,))
            ticket = cursor.fetchone()
            if not ticket:
                return jsonify({"error": "Ticket not found"}), 404
            
            return jsonify({"title": ticket["title"]})

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        connection.close()



# @app.route('/api/users', methods=['GET'])
# def get_users():
#     connection = create_connection()
#     if connection is None:
#         return jsonify({"error": "Failed to connect to the database"}), 500

#     try:
#         with connection.cursor(pymysql.cursors.DictCursor) as cursor:
#             # Call the stored procedure to get the list of all users
#             cursor.callproc('Proc_tblusers_displaylistofusers')
#             users = cursor.fetchall()  # Fetch all results
            
#             if not users:
#                 return jsonify({"error": "No users found"}), 404

#             # Convert the result to a list of dictionaries
#             users_list = []
#             for user in users:
#                 users_list.append({
#                     "id": user['id'],
#                     "fname": user['fname'],
#                     "lname": user['lname'],
#                     "emailid": user['emailid'],
#                     "role": user['role'],
#                     "account_no": user['account_no']
#                     # Add other fields as necessary
#                 })

#             return jsonify(users_list)
            
#     except pymysql.MySQLError as e:
#         print(f"The error '{e}' occurred")
#         return jsonify({"error": "Database query failed"}), 500
#     finally:
#         connection.close()

@app.route('/api/users', methods=['GET'])
def get_users():
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        # Use DictCursor to get results as dictionaries
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # --- UPDATED: Call the new stored procedure name ---
            cursor.callproc('sp_get_users_with_groups') # Use the correct name of your updated SP
            users = cursor.fetchall() # Fetch all results from the SP
            # --- END UPDATED ---

            # --- UPDATED: Handle potentially empty initial fetch correctly ---
            # The check for 'not users' should ideally come after fetching.
            # If the SP executes but returns no rows, users will be an empty list [].
            # If there's an issue calling the SP, it might raise an exception before this.
            if users is None or len(users) == 0: # Check if list is empty
                return jsonify([]) # Return empty list instead of 404, consistent with typical API behavior for "no data found"
                # Alternatively, you could keep the 404: return jsonify({"error": "No users found"}), 404

            # --- Process the results ---
            users_list = []
            for user in users:
                # Handle potential NULL value from GROUP_CONCAT
                # If a user has no groups, group_names might be None/NULL
                group_names_str = user.get('group_names')
                groups_list = []
                if group_names_str: # Check if it's not None or empty string
                    # Split the comma-separated string into a list
                    groups_list = [name.strip() for name in group_names_str.split(',') if name.strip()]

                users_list.append({
                    "id": user['id'],
                    "fname": user['fname'],
                    "lname": user['lname'],
                    "emailid": user['emailid'],
                    "role": user['role'], # Assuming your SP returns 'role' (from tblrole.name)
                    "account_no": user['account_no'],
                    # --- NEW: Include the processed groups list ---
                    "groups": groups_list # Add the list of group names
                    # --- END NEW ---
                    # Add other fields from the SP result if needed
                })

            return jsonify(users_list)

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": f"Database query failed: {str(e)}"}), 500
    except Exception as e: # Catch other potential errors during processing
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An error occurred while processing user data"}), 500
    finally:
        if connection:
            connection.close()



@app.route('/api/user/<int:user_id>/manage-groups', methods=['POST'])
def manage_user_groups(user_id):
    """
    API endpoint to add/remove specific groups for a user.
    Expects JSON: { "add": [group_id1, group_id2, ...], "remove": [group_id3, ...] }
    """
    connection = create_connection()
    if not connection:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON data"}), 400

        groups_to_add = data.get('add', [])
        groups_to_remove = data.get('remove', [])

        # Basic validation: ensure add and remove are lists of integers
        if not isinstance(groups_to_add, list) or not all(isinstance(gid, int) for gid in groups_to_add):
             return jsonify({"error": "'add' must be a list of integers"}), 400
        if not isinstance(groups_to_remove, list) or not all(isinstance(gid, int) for gid in groups_to_remove):
             return jsonify({"error": "'remove' must be a list of integers"}), 400

        with connection.cursor() as cursor:
            # --- Add Groups ---
            if groups_to_add:
                # Prepare tuples for executemany
                add_data = [(user_id, gid) for gid in groups_to_add]
                # Use INSERT IGNORE to prevent errors if the association already exists
                add_sql = "INSERT IGNORE INTO tbluser_groups (user_id, group_id) VALUES (%s, %s)"
                cursor.executemany(add_sql, add_data)

            # --- Remove Groups ---
            if groups_to_remove:
                # Prepare format strings for IN clause
                placeholders = ','.join(['%s'] * len(groups_to_remove))
                remove_sql = f"DELETE FROM tbluser_groups WHERE user_id = %s AND group_id IN ({placeholders})"
                # Execute with user_id and list of group_ids to remove
                cursor.execute(remove_sql, [user_id] + groups_to_remove)

        connection.commit()
        return jsonify({"message": "User groups updated successfully"}), 200

    except pymysql.MySQLError as e:
        connection.rollback()
        print(f"Database error managing user groups: {e}")
        return jsonify({"error": "Database operation failed"}), 500
    except Exception as e:
        connection.rollback()
        print(f"Unexpected error managing user groups: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        connection.close()



@app.route('/api/groups', methods=['POST'])
def create_group():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({"error": "Group name is required"}), 400
    connection = create_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO tblgroups (name) VALUES (%s)", (name,))
            connection.commit()
            new_group_id = cursor.lastrowid
        return jsonify({"id": new_group_id, "name": name}), 201
    except Exception as e:
        connection.rollback()
        print(f"Error creating group: {e}")
        return jsonify({"error": "Failed to create group"}), 500
    finally:
        connection.close()


@app.route('/api/group/<int:group_id>', methods=['PUT'])
def rename_group(group_id):
    data = request.get_json()
    new_name = data.get('name')
    if not new_name:
        return jsonify({"error": "New group name is required"}), 400
    connection = create_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        with connection.cursor() as cursor:
            cursor.execute("UPDATE tblgroups SET name = %s WHERE id = %s", (new_name, group_id))
            if cursor.rowcount == 0:
                 return jsonify({"error": "Group not found"}), 404
            connection.commit()
        return jsonify({"message": "Group renamed"}), 200
    except Exception as e:
        connection.rollback()
        print(f"Error renaming group: {e}")
        return jsonify({"error": "Failed to rename group"}), 500
    finally:
        connection.close()


@app.route('/api/group/<int:group_id>', methods=['DELETE'])
def delete_group(group_id):
    connection = create_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM tblgroups WHERE id = %s", (group_id,))
            if cursor.rowcount == 0:
                 return jsonify({"error": "Group not found"}), 404
            connection.commit() # ON DELETE CASCADE handles tbluser_groups
        return jsonify({"message": "Group deleted"}), 200
    except Exception as e:
        connection.rollback()
        print(f"Error deleting group: {e}")
        return jsonify({"error": "Failed to delete group"}), 500
    finally:
        connection.close()


@app.route('/api/group/<int:group_id>/users', methods=['GET'])
def get_users_in_group(group_id):
    connection = create_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
                SELECT u.id, u.fname, u.lname, u.emailid, u.role_id, r.name as role
                FROM tblusers u
                JOIN tbluser_groups ug ON u.id = ug.user_id
                JOIN tblrole r ON u.role_id = r.id
                WHERE ug.group_id = %s AND IFNULL(u.isDeleted, 0) = 0
                ORDER BY u.fname, u.lname
            """, (group_id,))
            users = cursor.fetchall()
        return jsonify(users), 200
    except Exception as e:
        print(f"Error fetching users for group {group_id}: {e}")
        return jsonify({"error": "Failed to fetch users for group"}), 500
    finally:
        connection.close()


@app.route('/api/group/<int:group_id>/manage-users', methods=['POST'])
def manage_group_users(group_id): # Accept { add: [], remove: [] }
    connection = create_connection()
    if not connection:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON data"}), 400

        users_to_add = data.get('add', [])
        users_to_remove = data.get('remove', [])

        # Basic validation
        if not isinstance(users_to_add, list) or not all(isinstance(uid, int) for uid in users_to_add):
             return jsonify({"error": "'add' must be a list of integers"}), 400
        if not isinstance(users_to_remove, list) or not all(isinstance(uid, int) for uid in users_to_remove):
             return jsonify({"error": "'remove' must be a list of integers"}), 400

        with connection.cursor() as cursor:
            # --- Add Users ---
            if users_to_add:
                add_data = [(uid, group_id) for uid in users_to_add]
                add_sql = "INSERT IGNORE INTO tbluser_groups (user_id, group_id) VALUES (%s, %s)"
                cursor.executemany(add_sql, add_data)

            # --- Remove Users ---
            if users_to_remove:
                placeholders = ','.join(['%s'] * len(users_to_remove))
                remove_sql = f"DELETE FROM tbluser_groups WHERE group_id = %s AND user_id IN ({placeholders})"
                cursor.execute(remove_sql, [group_id] + users_to_remove)

        connection.commit()
        return jsonify({"message": "Group users updated successfully"}), 200

    except pymysql.MySQLError as e:
        connection.rollback()
        print(f"Database error managing group users: {e}")
        return jsonify({"error": "Database operation failed"}), 500
    except Exception as e:
        connection.rollback()
        print(f"Unexpected error managing group users: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        connection.close()


# ---------------on 11 09 2024 -------------




@app.route('/api/assign_ticket', methods=['POST'])
def assign_ticket():
    data = request.json
    ticket_id = data.get('ticket_id')
    user_id = data.get('user_id')

    if not ticket_id or not user_id:
        return jsonify({"error": "Missing required fields"}), 400

    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            # Update the assigned user for the ticket
            cursor.callproc('Proc_tbltickets_UpdateAssignedTo', (ticket_id, user_id))
            connection.commit()

            # Fetch the assigned user's email address
            cursor.execute("SELECT emailid FROM tblusers WHERE id = %s", (user_id,))
            assigned_user_email_result = cursor.fetchone()
            assigned_user_email = assigned_user_email_result["emailid"] if assigned_user_email_result else None

            if assigned_user_email:
                # Fetch ticket details to include in the email
                cursor.execute("SELECT title, description FROM tbltickets WHERE id = %s", (ticket_id,))
                ticket_details = cursor.fetchone()
                title = ticket_details["title"] if ticket_details else "Ticket"
                description = ticket_details["description"] if ticket_details else ""

                # Send email notification to assigned user
                send_email_notification_assignment(ticket_id, title, description, assigned_user_email)

            return jsonify({"message": "Ticket assigned successfully"})

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Failed to assign ticket"}), 500
    finally:
        connection.close()


# Function to send email notification to assigned user
def send_email_notification_assignment(ticket_id, title, description, assigned_user_email):
    try:


        # Create the email message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = assigned_user_email  # Set assigned user's email as main recipient
        msg['Subject'] = f"You have been assigned a new Ticket ID {ticket_id}"

        # Add body text
        body = f"You have been assigned to a new ticket.\n\nTicket ID: {ticket_id}\nTitle: {title}\nDescription: {description}"
        msg.attach(MIMEText(body, 'plain'))

        # Create secure connection with server and send the email
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_server, port) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(sender_email, password)
            server.sendmail(sender_email, assigned_user_email, msg.as_string())

        print("Email sent successfully to the assigned user")
    except Exception as e:
        print(f"Email sending failed: {e}")




@app.route('/api/my-tickets', methods=['GET'])

@login_required
def get_user_ticket_by_id():
    # Fetch user_id from the session
    user_id = session.get("user_id")
    
    # If user_id is not available, return an error
    if not user_id:
        return jsonify({"error": "User ID not found in session"}), 401
    
    # Create database connection
    connection = create_connection()
    
    # Handle the case where the connection fails
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Call the stored procedure to get the latest 5 opened tickets
            cursor.callproc("Proc_tbltickets_SelectAssignedTicketsOfUser", (user_id,))
            
            # Fetch the result from the procedure
            latest_opened_tickets = cursor.fetchall()
            
            # Log the raw result for debugging purposes
            # print("Raw result:", latest_opened_tickets)

            # Decode any bytes to strings if necessary
            for ticket in latest_opened_tickets:
                for key, value in ticket.items():
                    if isinstance(value, bytes):
                        ticket[key] = value.decode("utf-8")

            # Return the tickets as a JSON response
            return jsonify(latest_opened_tickets), 200

    except pymysql.MySQLError as e:
        # Log any MySQL errors for debugging
        print(f"MySQL error occurred: {e}")
        return jsonify({"error": "Database query failed"}), 500

    except Exception as e:
        # Log unexpected errors
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

    finally:
        # Ensure the connection is closed in all cases
        connection.close()


@app.route('/api/created-tickets', methods=['GET'])
@login_required
def get_tickets_created_by_me():
    # Fetch user_id from the session
    user_id = session.get("user_id")
    
    # If user_id is not available, return an error
    if not user_id:
        return jsonify({"error": "User ID not found in session"}), 401
    
    # Create database connection
    connection = create_connection()
    
    # Handle the case where the connection fails
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            # Call the stored procedure to get tickets created by the user
            cursor.callproc("Proc_tbltickets_GetTicketsCreatedBy", (user_id,))
            
            # Fetch the result from the procedure
            created_tickets = cursor.fetchall()
            
            # Log the raw result for debugging purposes
            # print("Raw result:", created_tickets)

            # Decode any bytes to strings if necessary
            for ticket in created_tickets:
                for key, value in ticket.items():
                    if isinstance(value, bytes):
                        ticket[key] = value.decode("utf-8")

            # Return the tickets as a JSON response
            return jsonify(created_tickets), 200

    except pymysql.MySQLError as e:
        # Log any MySQL errors for debugging
        print(f"MySQL error occurred: {e}")
        return jsonify({"error": "Database query failed"}), 500

    except Exception as e:
        # Log unexpected errors
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

    finally:
        # Ensure the connection is closed in all cases
        connection.close()



@app.route('/api/get_assigned_user/<int:ticket_id>', methods=['GET'])
def get_assigned_user(ticket_id):
    # Create database connection
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            # Call the stored procedure to fetch the assigned user for the given ticket ID
            cursor.callproc('Proc_tbltickets_GetAssignedUser', [ticket_id])
            result = cursor.fetchone()  # Assuming the stored procedure returns one row
            
            if result:
                return jsonify(result), 200
            else:
                return jsonify({"message": "No user assigned to this ticket"}), 404

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({'error': 'Failed to fetch assigned user'}), 500

    finally:
        connection.close()  # Ensure the connection is closed




@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()  # Clear all session data
    response = jsonify({'message': 'Logged out successfully'})
    response.status_code = 200
    return response



@app.route('/api/check-session', methods=['GET'])
def check_session():
    if 'user_id' not in session:
        return jsonify({'authenticated': False}), 401
    return jsonify({'authenticated': True})




# @app.route("/api/user", methods=["GET"])
# @login_required
# def get_user_data():
#     user_id = session.get("user_id")
#     if not user_id:
#         return jsonify({"error": "User not logged in"}), 401

#     connection = create_connection()
#     if connection is None:
#         return jsonify({"error": "Failed to connect to the database"}), 500

#     try:
#         with connection.cursor(pymysql.cursors.DictCursor) as cursor:
#             cursor.execute("SELECT * FROM tblusers WHERE id = %s", (user_id,))
#             user = cursor.fetchone()
#             if user:
#                 return jsonify({"email": user['emailid'], "role": user["role_id"], "password": user['password'], "fname":user['fname'],"lname":user['lname'],"dob":user['dob'],"address":user['address'],"account_no":user['account_no'],"mobileno":user['mobileno']})  # Return all fields in the user dictionary
#             else:
#                 return jsonify({"error": "User not found"}), 404
#     except pymysql.MySQLError as e:
#         print(f"The error '{e}' occurred")
#         return jsonify({"error": "Database query failed"}), 500
#     finally:
#         connection.close()


@app.route("/api/user", methods=["GET"])
@login_required
def get_user_data():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM tblusers WHERE id = %s", (user_id,))
            user = cursor.fetchone()
            if user:
                return jsonify({
                    "email": user['emailid'],
                    "role": user["role_id"],
                    "password": user['password'],  # It's generally not a good idea to send passwords back
                    "fname": user['fname'],
                    "lname": user['lname'],
                    "dob": user['dob'],
                    "address": user['address'],
                    "account_no": user['account_no'],
                    "mobileno": user['mobileno']
                })  
            else:
                return jsonify({"error": "User not found"}), 404
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    finally:
        connection.close()


# @app.route('/api/user/profile', methods=['GET'])
# @login_required
# def get_current_user():
#     user_id = session.get('user_id')  # Get user ID from the session
#     if not user_id:
#         return jsonify({"error": "User not logged in"}), 401
    
#     try:
#         cursor = mysql.connection.cursor()
#         query = "SELECT emailid, fname, lname, dob, address, account_no, mobileno, role_id FROM tblusers WHERE id = %s"
#         cursor.execute(query, (user_id,))
#         user = cursor.fetchone()
#         if user:
#             user_data = {
#                 "emailid": user[0],
#                 "fname": user[1],
#                 "lname": user[2],
#                 "dob": user[3],
#                 "address": user[4],
#                 "account_no": user[5],
#                 "mobileno": user[6],
#                 "role_id": user[7]
#             }
#             return jsonify(user_data), 200
#         return jsonify({"message": "User not found"}), 404
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# from flask import jsonify, session
# import MySQLdb  # Assuming you're using MySQLdb or a similar MySQL connector

@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    # Fetch the user ID from the session
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    # Create database connection
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            # Query to get user profile information
            query = "SELECT * FROM tblusers WHERE id = %s"
            cursor.execute(query, (user_id,))
            user = cursor.fetchone()

            if user:
                return jsonify({
                    "id": user.get("id"),
                    "emailid": user.get("emailid"),
                    "password": user.get("password"),
                    "fname": user.get("fname"),
                    "lname": user.get("lname"),
                    "dob": user.get("dob"),
                    "address": user.get("address"),
                    "account_no": user.get("account_no"),
                    "mobileno": user.get("mobileno"),
                    "role_id": user.get("role_id"),
                    # Add more fields if necessary
                }), 200
            else:
                return jsonify({"error": "User not found"}), 404

    except pymysql.MySQLError as e:
        print(f"Database error occurred: {e}")
        return jsonify({"error": "Failed to fetch user profile"}), 500

    finally:
        connection.close()


@app.route('/api/user/update', methods=['POST'])
def update_user():
    # Check if user is logged in and get the user_id from session
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401  # Return 401 if user is not authenticated

    data = request.get_json()  # Get data from the request body
    
    # Extract user data from the JSON request
    p_id = data.get('id', user_id)  # Use the provided ID or fallback to session ID
    p_emailid = data.get('emailid')
    p_password = data.get('password')  # Ideally, hash this password before storing
    p_fname = data.get('fname')
    p_lname = data.get('lname')
    p_dob = data.get('dob')
    p_address = data.get('address')
    p_account_no = data.get('account_no')
    p_mobileno = data.get('mobileno')
    p_role_id = data.get('role_id')

    # Establish database connection
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            # Call the stored procedure to insert or update user details
            cursor.callproc('Proc_tblusers_Upsert', [
                p_id, p_emailid, p_password, p_fname, p_lname, p_dob,
                p_address, p_account_no, p_mobileno, p_role_id
            ])
            connection.commit()  # Commit changes to the database
            
            return jsonify({"message": "User details updated successfully."}), 200

    except pymysql.MySQLError as e:
        print(f"Database error occurred: {e}")
        return jsonify({"error": "Failed to update user details"}), 500

    finally:
        connection.close()  # Close the connection after query execution




@app.route('/api/delete-user', methods=['POST'])
def delete_user():
    # Extract user_id from request
    user_id = request.json.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    # Create database connection
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            # Call the stored procedure to soft delete the user
            cursor.callproc('Proc_tblusers_DeleteUser', [user_id])

            # Commit the changes to the database
            connection.commit()

        return jsonify({"message": "User deleted successfully"}), 200

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": str(e)}), 500

    finally:
        connection.close()



@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    connection = create_connection()
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    
    try:
        # Call the stored procedure
        cursor.callproc('Proc_tblusers_select', [user_id])
        
        # Fetch the result
        user = cursor.fetchone()
        
        if user:
            return jsonify(user), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while fetching user data"}), 500
    finally:
        cursor.close()
        connection.close()





@app.route('/api/user/update/<int:user_id>', methods=['POST'])
def update_user_byid(user_id):
    connection = create_connection()
    cursor = connection.cursor()
    
    try:
        data = request.json
        
        # Validate input
        required_fields = ["emailid", "fname", "lname", "dob", "address", "account_no", "mobileno", "role_id"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Prepare to call the stored procedure
        cursor.callproc('Proc_tblusers_Upsert', [
            user_id,
            data['emailid'],
            data['password'],
            data['fname'],
            data['lname'],
            data['dob'],
            data['address'],
            data['account_no'],
            data['mobileno'],
            data['role_id']
        ])
        
        connection.commit()  # Commit changes
        
        return jsonify({"message": "User updated successfully"}), 200
        
    except Exception as e:
        print(f"Error updating user: {e}")
        return jsonify({"error": "An error occurred while updating user data"}), 500
    finally:
        cursor.close()
        connection.close()



#------------------------MODULE 2 (Customer module)-------------------------#
@app.route("/api/submit", methods=["POST"])
def hotel_information():
    user_id = session.get("user_id")
    print(user_id)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    
    # Extract data from the request
    p_id = data.get('id', 0)
    p_date_submitted = data.get('formattedDate')
    p_hotelName = data.get('hotelName')
    p_hotelPhone = data.get('hotelPhone')
    p_hotelEmail = data.get('hotelEmail')
    p_hotelAddress = data.get('hotelAddress')
    p_hotelCity = data.get('hotelCity')
    p_hotelState = data.get('hotelState')
    p_hotelZipCode = data.get('hotelZipCode')
    p_hotelWebsite = data.get('hotelWebsite')
    p_hotelLogo = data.get('hotelLogo')
    p_hotelLogo_uniquename = data.get('hotelLogo_uniquename')
    p_propertyType = data.get('propertyType')
    p_totalRooms = data.get('totalRooms')
    p_lobbyHours = data.get('lobbyHours')
    p_nonSmoking = data.get('nonSmoking')
    p_propertyManagementSystemInformation = data.get('propertyManagementSystemInformation')
    p_hotelWifiNameAndPassword = data.get('hotelWifiNameAndPassword')
    p_ownerNameTitle = data.get('ownerNameTitle')
    p_ownerNameFirst = data.get('ownerNameFirst')
    p_ownerNameMiddle = data.get('ownerNameMiddle')
    p_ownerNameLast = data.get('ownerNameLast')
    p_ownerNameSuffix = data.get('ownerNameSuffix')
    p_ownerCellPhone = data.get('ownerCellPhone')
    p_ownerEmail = data.get('ownerEmail')
    p_dailyOperations = data.get('dailyOperations')
    p_emergencyContact = data.get('emergencyContact')
    p_liveOnSite = data.get('liveOnSite')
    p_roleInOperations = data.get('roleInOperations')
    p_petsAllowed = data.get('petsAllowed')
    p_semiTruckParking = data.get('semiTruckParking')
    p_boxTruckParking = data.get('boxTruckParking')
    p_parkingPassRequired = data.get('parkingPassRequired')
    p_breakfastIncluded = data.get('breakfastIncluded')
    p_fitnessCenter = data.get('fitnessCenter')
    p_businessCenter = data.get('businessCenter')
    p_guestLaundry = data.get('guestLaundry')
    p_poolAvailable = data.get('poolAvailable')
    p_meetingRoomAvailable = data.get('meetingRoomAvailable')
    p_bBQareaAvailable = data.get('bBQareaAvailable')
    p_generalManagerAvailable = data.get('generalManagerAvailable')
    p_AssistantManagerAvailable = data.get('AssistantManagerAvailable')
    p_maintanancePersonAvailable = data.get('maintanancePersonAvailable')
    p_HeadHouseKeeperAvailable = data.get('HeadHouseKeeperAvailable')
    p_HousemanAvailable = data.get('HousemanAvailable')
    p_securityPersonAvailable = data.get('securityPersonAvailable')
    p_sunDryShopAvailable = data.get('sunDryShopAvailable')
    p_onSiteATMAvailable = data.get('onSiteATMAvailable')
    p_ElevatorAvailable = data.get('ElevatorAvailable')
    p_numberofSign = data.get('numberofSign')
    p_guestVehicleData = data.get('guestVehicleData')
    p_luggageCartAvailable = data.get('luggageCartAvailable')
    p_generalManagerPhone = data.get('generalManagerPhone')
    p_assistantManagerPhone = data.get('assistantManagerPhone')
    p_maintanancePersonPhone = data.get('maintanancePersonPhone')
    p_houseKeepingHeadPhone = data.get('houseKeepingHeadPhone')
    p_roomCatagory = data.get('roomCatagory')
    p_roomAmmunities = data.get('roomAmmunities')
    p_maxRoomOccupants = data.get('maxRoomOccupants')
    p_floorMap = data.get('floorMap')
    p_minAge = data.get('minAge')
    p_inOutTime = data.get('inOutTime')
    p_vendingLocation = data.get('vendingLocation')
    p_securityDeposit = data.get('securityDeposit')
    p_depCashCart = data.get('depCashCart')
    p_smokingVoilationfee = data.get('smokingVoilationfee')
    p_babyCribs = data.get('babyCribs')
    p_rollawayBeds = data.get('rollawayBeds')
    p_distressedTravelItem = data.get('distressedTravelItem')
    p_localGuestPolicy = data.get('localGuestPolicy')
    p_hotelroomAllotment = data.get('hotelroomAllotment')
    p_earlyCheckIn = data.get('earlyCheckIn')
    p_earlyCheckInPolicy = data.get('earlyCheckInPolicy')
    p_latecheckout = data.get('latecheckout')
    p_peakSeason = data.get('peakSeason')
    p_cancellationPolicy = data.get('cancellationPolicy')
    p_cancellationPenalty = data.get('cancellationPenalty')
    p_earlyCheckoutPolicy = data.get('earlyCheckoutPolicy')
    p_baserate = data.get('baserate')
    p_extraPeopleCharge = data.get('extraPeopleCharge')
    p_kidsStayfree = data.get('kidsStayfree')
    p_anyMandatoryfee = data.get('anyMandatoryfee')
    p_inRoomSafe = data.get('inRoomSafe')
    p_weeklyRates = data.get('weeklyRates')
    p_montlyRates = data.get('montlyRates')
    p_codesType = data.get('codesType')
    p_craditcardAuthform = data.get('craditcardAuthform')
    p_petPolicy = data.get('petPolicy')
    p_nightAuditTime = data.get('nightAuditTime')
    p_speceficRepots = data.get('speceficRepots')
    p_instructionNightAudit = data.get('instructionNightAudit')
    p_noShowBeforeNightAudit = data.get('noShowBeforeNightAudit')
    p_dailyHousekeepingList = data.get('dailyHousekeepingList')
    p_roomServiceFrequencyforWeekly = data.get('roomServiceFrequencyforWeekly')
    p_roomServiceFrequencyforDaily = data.get('roomServiceFrequencyforDaily')
    p_inspectionRequired = data.get('inspectionRequired')
    p_housekeepingReport = data.get('housekeepingReport')
    p_itemsHotelSupplyinRoom = data.get('itemsHotelSupplyinRoom')
    p_itemsHotelSupplyinBathRoom = data.get('itemsHotelSupplyinBathRoom')
    p_volumeOfOnlineReservationinwalkIn = data.get('volumeOfOnlineReservationinwalkIn')
    p_walkoutrate = data.get('walkoutrate')
    p_discountFor = data.get('discountFor')
    p_specialRoom = data.get('specialRoom')
    p_roomFlooring = data.get('roomFlooring')
    p_parkandFlyFacilities = data.get('parkandFlyFacilities')
    p_utensilsRequired = data.get('utensilsRequired')
    p_extrahouseKeepingCharge = data.get('extrahouseKeepingCharge')
    p_montlyordailyReconcilination = data.get('montlyordailyReconcilination')
    p_extentinProcedures = data.get('extentinProcedures')
    p_housekeepingworkHours = data.get('housekeepingworkHours')
    p_maintananceworkHours = data.get('maintananceworkHours')
    p_timeforNostaff = data.get('timeforNostaff')
    p_thirdpartycc = data.get('thirdpartycc')
    p_preauthorizeArrival = data.get('preauthorizeArrival')
    p_acceptclc = data.get('acceptclc')
    p_roomswithBalcony = data.get('roomswithBalcony')
    p_DNRlist = data.get('DNRlist')
    p_regularCompany = data.get('regularCompany')
    p_recomendationtoGuest = data.get('recomendationtoGuest')
    p_onSiterecomendationtoGuest = data.get('onSiterecomendationtoGuest')
    p_lostandfound = data.get('lostandfound')
    p_internetProvider = data.get('internetProvider')
    p_pbxProvider = data.get('pbxProvider')
    p_KeyLockProvider = data.get('KeyLockProvider')
    p_taxRate = data.get('taxRate')
    p_kioskTimming = data.get('kioskTimming')
    p_giftCardd = data.get('giftCardd')
    p_secondryPhoneLine = data.get('secondryPhoneLine')
    p_additionalInformation = data.get('additionalInformation')

    # Connect to the database
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("SET @current_user_id = %s", (user_id,))
        # Call the stored procedure
        cursor.callproc('Proc_tblHotelInformation_Upsert', [
            p_id,
            p_date_submitted,
            p_hotelName,
            p_hotelPhone,
            p_hotelEmail,
            p_hotelAddress,
            p_hotelCity,
            p_hotelState,
            p_hotelZipCode,
            p_hotelWebsite,
            p_hotelLogo,
            p_hotelLogo_uniquename,
            p_propertyType,
            p_totalRooms,
            p_lobbyHours,
            p_nonSmoking,
            p_propertyManagementSystemInformation,
            p_hotelWifiNameAndPassword,
            p_ownerNameTitle,
            p_ownerNameFirst,
            p_ownerNameMiddle,
            p_ownerNameLast,
            p_ownerNameSuffix,
            p_ownerCellPhone,
            p_ownerEmail,
            p_dailyOperations,
            p_emergencyContact,
            p_liveOnSite,
            p_roleInOperations,
            p_petsAllowed,
            p_semiTruckParking,
            p_boxTruckParking,
            p_parkingPassRequired,
            p_breakfastIncluded,
            p_fitnessCenter,
            p_businessCenter,
            p_guestLaundry,
            p_poolAvailable,
            p_meetingRoomAvailable,
            p_bBQareaAvailable,
            p_generalManagerAvailable,
            p_AssistantManagerAvailable,
            p_maintanancePersonAvailable,
            p_HeadHouseKeeperAvailable,
            p_HousemanAvailable,
            p_securityPersonAvailable,
            p_sunDryShopAvailable,
            p_onSiteATMAvailable,
            p_ElevatorAvailable,
            p_numberofSign,
            p_guestVehicleData,
            p_luggageCartAvailable,
            p_generalManagerPhone,
            p_assistantManagerPhone,
            p_maintanancePersonPhone,
            p_houseKeepingHeadPhone,
            p_roomCatagory,
            p_roomAmmunities,
            p_maxRoomOccupants,
            p_floorMap,
            p_minAge,
            p_inOutTime,
            p_vendingLocation,
            p_securityDeposit,
            p_depCashCart,
            p_smokingVoilationfee,
            p_babyCribs,
            p_rollawayBeds,
            p_distressedTravelItem,
            p_localGuestPolicy,
            p_hotelroomAllotment,
            p_earlyCheckIn,
            p_earlyCheckInPolicy,
            p_latecheckout,
            p_peakSeason,
            p_cancellationPolicy,
            p_cancellationPenalty,
            p_earlyCheckoutPolicy,
            p_baserate,
            p_extraPeopleCharge,
            p_kidsStayfree,
            p_anyMandatoryfee,
            p_inRoomSafe,
            p_weeklyRates,
            p_montlyRates,
            p_codesType,
            p_craditcardAuthform,
            p_petPolicy,
            p_nightAuditTime,
            p_speceficRepots,
            p_instructionNightAudit,
            p_noShowBeforeNightAudit,
            p_dailyHousekeepingList,
            p_roomServiceFrequencyforWeekly,
            p_roomServiceFrequencyforDaily,
            p_inspectionRequired,
            p_housekeepingReport,
            p_itemsHotelSupplyinRoom,
            p_itemsHotelSupplyinBathRoom,
            p_volumeOfOnlineReservationinwalkIn,
            p_walkoutrate,
            p_discountFor,
            p_specialRoom,
            p_roomFlooring,
            p_parkandFlyFacilities,
            p_utensilsRequired,
            p_extrahouseKeepingCharge,
            p_montlyordailyReconcilination,
            p_extentinProcedures,
            p_housekeepingworkHours,
            p_maintananceworkHours,
            p_timeforNostaff,
            p_thirdpartycc,
            p_preauthorizeArrival,
            p_acceptclc,
            p_roomswithBalcony,
            p_DNRlist,
            p_regularCompany,
            p_recomendationtoGuest,
            p_onSiterecomendationtoGuest,
            p_lostandfound,
            p_internetProvider,
            p_pbxProvider,
            p_KeyLockProvider,
            p_taxRate,
            p_kioskTimming,
            p_giftCardd,
            p_secondryPhoneLine,
            p_additionalInformation,
            
        ])

        # Commit the changes
        connection.commit()

        return jsonify({"status": "success", "message": "Hotel information saved successfully."}), 201

    except pymysql.MySQLError as err:
        return jsonify({"status": "error", "message": str(err)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()







@app.route('/save-test', methods=['POST'])
def save_test():
    data = request.get_json()

    is_yes = data.get('isYes', 0)
    is_no = data.get('isNo', 0)
    is_other = data.get('isOther', 0)
    other_text = data.get('otherText', None)

    # Get values from the new Yes/No set
    is_yes2 = data.get('isYes2', 0)
    is_no2 = data.get('isNo2', 0)

    # Determine what to store in the first column based on the second set
    if is_yes2:
        is_yes = 1
        is_no = 0
    elif is_no2:
        is_yes = 0
        is_no = 1

    try:
        connection = create_connection()
        cursor = connection.cursor()
        query = """
            INSERT INTO test (IsYes, IsNo, IsOther, otherText)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (is_yes, is_no, is_other, other_text))
        cursor.connection.commit()  # Fixed reference to cursor.connection
        return jsonify({'message': 'Test record saved successfully.'}), 201

    except Exception as e:
        return jsonify({'message': 'Failed to save test record.', 'error': str(e)}), 500

    finally:
        cursor.close()
        connection.close()
# Route to retrieve all records
@app.route('/get-tests', methods=['GET'])
def get_tests():
    try:
        cursor = create_connection()
        cursor.execute("SELECT IsYes, IsNo, IsOther, otherText FROM test")
        rows = cursor.fetchall()

        tests = []
        for row in rows:
            test = {
                'isYes': bool(row[0]),
                'isNo': bool(row[1]),
                'isOther': bool(row[2]),
                'otherText': row[3]
            }
            tests.append(test)

        return jsonify(tests), 200

    except Exception as e:
        return jsonify({'message': 'Failed to retrieve tests.', 'error': str(e)}), 500

    finally:
        cursor.close()



@app.route('/submit_equipment_form', methods=['POST'])
def submit_equipment_form():
    user_id = session.get("user_id")
    print(user_id)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    try:
        # Extract the form data
        form_data = request.form

        p_id = form_data.get('id', 0)
        p_firstname = form_data.get('firstName')
        p_lastname = form_data.get('lastName')
        p_propertyName = form_data.get('propertyName')
        p_address = form_data.get('addressLine1')
        p_address1 = form_data.get('addressLine2')
        p_city = form_data.get('city')
        p_state = form_data.get('state')
        p_zipCode = form_data.get('zipCode')
        p_phone = form_data.get('phone')
        p_email = form_data.get('email')
        p_keyLockProvider = form_data.get('keyLockProvider')
        p_locktype = form_data.get('locktype')
        p_provideSupportNumber = form_data.get('provideSupportNumber')
        p_keyEncoderModel_Serial = form_data.get('keyEncoderModel')

        # Handling file upload
        p_keyEncoderPhotos = request.files.get('keyEncoderPhotos')
        p_keyEncoderPhotosUniqueName = p_keyEncoderPhotos.filename if p_keyEncoderPhotos else None
        
        p_PINpadModel = form_data.get('PINpadModel')
        p_PBXSystem = form_data.get('PBXSystem')
        p_PBXProvider = form_data.get('PBXProvider')
        p_providerSupportNumber2 = form_data.get('providerSupportNumber2')

        # Call the stored procedure to insert or update the data
        conn = create_connection()
        cursor = conn.cursor()
        cursor.execute("SET @current_user_id = %s", (user_id,))
        
        cursor.callproc('Proc_tblthirdpartyequipment_Upsert', [
            p_id, p_firstname, p_lastname, p_propertyName, p_address,p_address1, p_city, p_state, p_zipCode,
            p_phone, p_email, p_keyLockProvider, p_locktype, p_provideSupportNumber, 
            p_keyEncoderModel_Serial,p_keyEncoderPhotos, p_keyEncoderPhotosUniqueName, p_PINpadModel, 
            p_PBXSystem, p_PBXProvider, p_providerSupportNumber2
        ])
        
        # Commit the changes
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Form submitted successfully"}), 200
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Failed to submit form"}), 500
        return jsonify({"message": "Form submitted successfully!"}), 200

@app.route('/api/shift', methods=['POST'])
def manage_shift():
    """API endpoint to insert/update shift information."""
    data = request.json
    p_id = data.get("id", 0)  # Default to 0 if not provided
    p_hotelId = data.get("hotelId")
    p_userId = data.get("userId")
    p_selectDate = data.get("selectDate")
    p_startTime = data.get("startTime")
    p_endTime = data.get("endTime")

    if not all([p_hotelId, p_userId, p_selectDate, p_startTime, p_endTime]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        conn = create_connection()
        cursor = conn.cursor()

        # Call the stored procedure
        cursor.callproc('YourStoredProcedureName', 
                        [p_id, p_hotelId, p_userId, p_selectDate, p_startTime, p_endTime])

        # Fetch the result
        result = cursor.fetchall()

        # Commit the transaction
        conn.commit()

        return jsonify({"success": True, "data": result}), 200

    except pymysql.MySQLError as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


@app.route("/api/thirdpartyequipment", methods=["GET"])
@login_required
def get_thirdpartyequipment_info():
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Call the stored procedure
            cursor.callproc("Proc_tblthirdpartyequipment_Select")
            
            # Fetch the result
            opened_tickets = cursor.fetchall()
            
            # Print raw result for debugging
            # print("Raw result:", opened_tickets)

            # Decode bytes fields to strings, if any
            for ticket in opened_tickets:
                for key, value in ticket.items():
                    if isinstance(value, bytes):
                        ticket[key] = value.decode("utf-8")

            return jsonify(opened_tickets), 200
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        connection.close()

@app.route("/api/propertyOnboarding", methods=["GET"])
@login_required
def get_propertyOnboarding_info():
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Call the stored procedure
            cursor.callproc("Proc_tblHotelInformation_Select")
            
            # Fetch the result
            opened_tickets = cursor.fetchall()
            
            # Print raw result for debugging
            # print("Raw result:", opened_tickets)

            # Decode bytes fields to strings, if any
            for ticket in opened_tickets:
                for key, value in ticket.items():
                    if isinstance(value, bytes):
                        ticket[key] = value.decode("utf-8")

            return jsonify(opened_tickets), 200
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        connection.close()



@app.route('/states', methods=['GET'])
def get_states():
    conn = create_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.callproc('Proc_tblstate_selectstatesfordropdown')
            roles_options = cursor.fetchall()
            
            # Print raw result for debugging
            # print("Raw result:", roles_options)

            return jsonify(roles_options), 200

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        conn.close()

@app.route('/lock-types', methods=['GET'])
def get_locktypes():
    conn = create_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.callproc('Proc_tblLockType_selectlocktypefordropdown')
            roles_options = cursor.fetchall()
            
            # Print raw result for debugging
            # print("Raw result:", roles_options)

            return jsonify(roles_options), 200

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        conn.close()
@app.route('/api/hotel-submissions', methods=['GET'])
def get_locktypess():
    conn = create_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.callproc('Proc_tblLockType_selectlocktypefordropdown')
            roles_options = cursor.fetchall()
            
            # Print raw result for debugging
            # print("Raw result:", roles_options)

            return jsonify(roles_options), 200

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        conn.close()




#----------------------TASK MANGAGER--------------------



port = 587  # For starttls
smtp_server = "smtp.gmail.com"
sender_email = "noreply@kiotel.co"
password = "tfyr kugr sjpj ayvh"






@app.route("/api/task", methods=["POST"])
@login_required
def create_task():
    if session.get("is_creating_task"):
        return jsonify({"error": "Request already in progress"}), 429  # Too Many Requests

    session["is_creating_task"] = True  # Lock

    try:
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"error": "User ID not found in session"}), 400

        title = request.form.get("title")
        description = request.form.get("description")
        assigned_users = request.form.getlist("assignedUsers[]")
        task_state = request.form.get("ticketState")
        task_priority = request.form.get("ticketPriority")
        attachments = request.files.getlist("attachments")

        # ✅ NEW: Get selected tags
        tags = request.form.getlist("tags[]")  # List of tag IDs like ['1', '3']
        tags_str = ",".join([str(t) for t in tags]) if tags else None

        if not title or not description:
            return jsonify({"error": "Title and description are required"}), 400

        connection = create_connection()
        if connection is None:
            return jsonify({"error": "Failed to connect to the database"}), 500

        try:
            attachment_filenames = []
            upload_folder = app.config['UPLOAD_FOLDER']

            with connection.cursor() as cursor:
                # Handle file attachments
                if attachments:
                    for attachment in attachments:
                        original_filename = attachment.filename
                        unique_name = generate_unique_name(original_filename)
                        file_path = os.path.join(upload_folder, unique_name)
                        attachment.save(file_path)
                        attachment_filenames.append(original_filename)
                        attachment_filenames.append(unique_name)

                attachments_json = json.dumps(attachment_filenames)

                # Set current user context
                cursor.execute("SET @current_user_id = %s", (user_id,))

                # Call SP with new `tags_str` parameter
                cursor.callproc('Proc_tbltasks_Upsert_test_2', (
                    0,                              # IN p_task_id (0 = insert)
                    title,                          # IN p_title
                    description,                    # IN p_description
                    attachments_json,               # IN p_attachments_json
                    None,                           # IN p_attachment_name (legacy)
                    task_state,                     # IN p_status_id
                    json.dumps(assigned_users),     # IN p_assigned_users_json
                    task_priority,                  # IN p_priority_id
                    tags_str                        # IN p_tags (new parameter)
                ))

                connection.commit()

                # Fetch emails for notification
                assigned_user_emails = []
                if assigned_users:
                    placeholders = ','.join(['%s'] * len(assigned_users))
                    cursor.execute(f"SELECT emailid FROM tblusers WHERE id IN ({placeholders})", assigned_users)
                    assigned_user_emails = [row['emailid'] for row in cursor.fetchall()]

                cursor.execute("SELECT emailid FROM tblusers WHERE id = %s", (user_id,))
                creator_email_row = cursor.fetchone()
                creator_email = creator_email_row['emailid'] if creator_email_row else None

                # Send email notification
                send_email_notification_new_task(
                    title, description, cursor.lastrowid,
                    creator_email, assigned_user_emails
                )

                return jsonify({"message": "Task created successfully"}), 201

        except pymysql.MySQLError as e:
            connection.rollback()
            print(f"Database error: {e}")
            return jsonify({"error": "Database operation failed"}), 500

        finally:
            connection.close()

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "An internal error occurred"}), 500

    finally:
        session.pop("is_creating_task", None)


# @app.route("/api/task", methods=["POST"])
# @login_required
# def create_task():
#     if session.get("is_creating_task"):
#         return jsonify({"error": "Request already in progress"}), 429

#     session["is_creating_task"] = True

#     try:
#         user_id = session.get("user_id")
#         if not user_id:
#             return jsonify({"error": "User ID not found in session"}), 400

#         title = request.form.get("title")
#         description = request.form.get("description")
#         assigned_users = request.form.getlist("assignedUsers[]")
#         task_state = request.form.get("ticketState")
#         task_priority = request.form.get("ticketPriority")
#         attachments = request.files.getlist("attachments")

#         # ✅ Get selected tags
#         tags = request.form.getlist("tags[]")  # List of tag IDs like ['1', '3']
#         tags_str = ",".join([str(t) for t in tags]) if tags else None

#         if not title or not description:
#             return jsonify({"error": "Title and description are required"}), 400

#         connection = create_connection()
#         if connection is None:
#             return jsonify({"error": "Failed to connect to the database"}), 500

#         try:
#             unique_filenames = []  # Store unique names for DB/storage
#             upload_folder = app.config['UPLOAD_FOLDER']

#             # Validate Upload Folder
#             if not os.path.exists(upload_folder):
#                 print(f"ERROR: Upload folder does not exist: {upload_folder}")
#                 return jsonify({"error": "Server configuration error: Upload folder missing"}), 500
#             if not os.access(upload_folder, os.W_OK):
#                 print(f"ERROR: No write permission for upload folder: {upload_folder}")
#                 return jsonify({"error": "Server configuration error: Insufficient permissions for upload folder"}), 500

#             # Handle File Attachments
#             if attachments:
#                 print(f"INFO: Processing {len(attachments)} attachments.")
#                 for attachment in attachments:
#                     if attachment and attachment.filename != '':
#                         original_filename = attachment.filename
#                         print(f"INFO: Processing file: {original_filename}")

#                         # Generate unique name
#                         unique_name = generate_unique_name(original_filename)
#                         print(f"DEBUG: Generated unique name: {unique_name}")

#                         # Define full file path
#                         file_path = os.path.join(upload_folder, unique_name)
#                         print(f"DEBUG: Full file path: {file_path}")

#                         try:
#                             # Save the file
#                             attachment.save(file_path)
#                             print(f"INFO: File saved successfully: {file_path}")

#                             # Store the unique name (THIS IS THE CHANGE)
#                             unique_filenames.append(unique_name)  # Use unique_name here

#                         except Exception as save_error:
#                             print(f"ERROR: Failed to save file {original_filename} -> {file_path}. Error: {save_error}")
#                             raise save_error
#                     else:
#                         print("WARNING: Received an empty or unnamed file part. Skipping.")
#             else:
#                 print("INFO: No attachments received.")

#             # Prepare Data for DB
#             attachments_json = json.dumps(unique_filenames)  # Pass unique names to the SP
#             print(f"DEBUG: attachments_json to store in DB: {attachments_json}")

#             with connection.cursor() as cursor:
#                 # Set current user context
#                 cursor.execute("SET @current_user_id = %s", (user_id,))

#                 # Call SP with unique filenames and tags
#                 print(f"DEBUG: Calling Proc_tbltasks_Upsert_test_2 with attachments_json: {attachments_json}, tags_str: {tags_str}")
#                 cursor.callproc('Proc_tbltasks_Upsert_test_2', (
#                     0,                              # IN p_task_id (0 = insert)
#                     title,                          # IN p_title
#                     description,                    # IN p_description
#                     attachments_json,               # IN p_attachments_json (now unique names)
#                     unique_name,                           # IN p_attachment_name (legacy, likely unused)
#                     task_state,                     # IN p_status_id
#                     json.dumps(assigned_users),     # IN p_assigned_users_json
#                     task_priority,                  # IN p_priority_id
#                     tags_str                        # IN p_tags
#                 ))

#                 connection.commit()
#                 new_task_id = cursor.lastrowid
#                 print(f"INFO: Task created successfully with ID: {new_task_id}")

#             return jsonify({"message": "Task created successfully", "task_id": new_task_id}), 201

#         except Exception as file_save_error:
#             connection.rollback()
#             print(f"ERROR (File Save/DB): {file_save_error}")
#             return jsonify({"error": f"Failed to process attachments or save task: {str(file_save_error)}"}), 500

#         finally:
#             connection.close()
#             print("DEBUG: Database connection closed.")

#     except Exception as e:
#         print(f"ERROR (Unexpected): {e}")
#         return jsonify({"error": f"An internal error occurred: {str(e)}"}), 500

#     finally:
#         session.pop("is_creating_task", None)
#         print("DEBUG: Session lock released.")




# @app.route("/api/task", methods=["POST"])
# @login_required
# def create_task():
#     if session.get("is_creating_task"):
#         return jsonify({"error": "Request already in progress"}), 429  # Too Many Requests

#     session["is_creating_task"] = True  # Lock

#     try:
#         user_id = session.get("user_id")
#         if not user_id:
#             return jsonify({"error": "User ID not found in session"}), 400

#         title = request.form.get("title")
#         description = request.form.get("description")
#         assigned_users = request.form.getlist("assignedUsers[]")
#         task_state = request.form.get("ticketState")
#         task_priority = request.form.get("ticketPriority")
#         attachments = request.files.getlist("attachments")

#         if not title or not description:
#             return jsonify({"error": "Title and description are required"}), 400

#         connection = create_connection()
#         if connection is None:
#             return jsonify({"error": "Failed to connect to the database"}), 500

#         try:
#             attachment_filenames = []
#             upload_folder = app.config['UPLOAD_FOLDER']

#             with connection.cursor() as cursor:
#                 if attachments:
#                     for attachment in attachments:
#                         original_filename = attachment.filename
#                         unique_name = generate_unique_name(original_filename)
#                         file_path = os.path.join(upload_folder, unique_name)
#                         attachment.save(file_path)
#                         attachment_filenames.append(original_filename)

#                 attachments_json = json.dumps(attachment_filenames)

#                 cursor.execute("SET @current_user_id = %s", (user_id,))
#                 cursor.callproc('Proc_tbltasks_Upsert_test', (
#                     0, title, description, attachments_json, None, task_state,
#                     json.dumps(assigned_users), task_priority
#                 ))

#                 connection.commit()

#                 # Fetch emails and send notifications
#                 assigned_user_emails = []
#                 if assigned_users:
#                     cursor.execute(
#                         "SELECT emailid FROM tblusers WHERE id IN ({})".format(','.join(map(str, assigned_users)))
#                     )
#                     assigned_user_emails = [row['emailid'] for row in cursor.fetchall()]

#                 cursor.execute("SELECT emailid FROM tblusers WHERE id = %s", (user_id,))
#                 creator_email = cursor.fetchone()['emailid']

#                 send_email_notification_new_task(title, description, cursor.lastrowid, creator_email, assigned_user_emails)

#         except pymysql.MySQLError as e:
#             connection.rollback()
#             print(f"Database error: {e}")
#             return jsonify({"error": "Database operation failed"}), 500
#         finally:
#             connection.close()

#         return jsonify({"message": "Task created successfully"}), 201

#     finally:
#         session.pop("is_creating_task", None)  # Unlock

def send_email_notification_new_task(title, description, ticket_id, creator_email, assigned_user_emails):
    try:
        # Create the email message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = creator_email  # Set the task creator's email as the main recipient
        msg['Cc'] = ', '.join(assigned_user_emails)  # Add all assigned users to CC
        msg['Subject'] = "New Task Created and Assigned"

        # Add body text
        body = f"New Task Created\n\nTask ID: {ticket_id}\nTitle: {title}\nDescription: {description}"
        msg.attach(MIMEText(body, 'plain'))

        # List of recipients (task creator and assigned users)
        recipients = [creator_email] + assigned_user_emails

        # Create secure connection with the server and send the email
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_server, port) as server:
            server.ehlo()  # Optional
            server.starttls(context=context)
            server.ehlo()  # Optional
            server.login(sender_email, password)
            server.sendmail(sender_email, recipients, msg.as_string())

        print("Email sent successfully to the task creator and assigned users")
    except Exception as e:
        print(f"Email sending failed: {e}")


@app.route("/api/opened_task", methods=["GET"])
@login_required
def get_opened_tasks():
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Call the stored procedure
            # cursor.callproc("Proc_tbltasks_DisplayOpenedtasks")
            cursor.callproc("Proc_test_task")
            
            # Fetch the result
            opened_tickets = cursor.fetchall()
            
            # Print raw result for debugging
            # print("Raw result:", opened_tickets)

            # Decode bytes fields to strings, if any
            for ticket in opened_tickets:
                for key, value in ticket.items():
                    if isinstance(value, bytes):
                        ticket[key] = value.decode("utf-8")

            return jsonify(opened_tickets), 200
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        connection.close()



@app.route("/api/task/<int:task_id>", methods=["GET"])
@login_required
def get_task(task_id):
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.callproc("Proc_tbltaskss_DisplaytasksById", (task_id,))
            result = cursor.fetchall()

            # Debugging: Print result for verification
            # print("Query Result:", result)

            if not result:
                return jsonify({"error": "Ticket not found"}), 404

            ticket = result[0]

            for key, value in ticket.items():
                if isinstance(value, bytes):
                    ticket[key] = value.decode("utf-8")

            if 'attachments' in ticket and isinstance(ticket['attachments'], str):
                ticket['attachments'] = json.loads(ticket['attachments'])

            return jsonify(ticket), 200
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        connection.close()








@app.route("/api/task/<int:task_id>/reply", methods=["POST"])
def reply_to_task(task_id):
    print(f"Received request for ticket ID: {task_id}")
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        description = request.form.get("description")

        # Fetch user_id from the session
        user_id = session.get('user_id')
        if user_id is None:
            return jsonify({"error": "User not logged in"}), 401

        # Process attachments
        attachments = request.files.getlist("attachments")
        original_filenames = []
        unique_names = []
        upload_folder = 'uploads/replies'
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        for file in attachments:
            if file:
                original_filename = file.filename
                unique_name = generate_unique_name(original_filename)
                file_path = os.path.join(upload_folder, unique_name)
                file.save(file_path)
                # Store only the original filename
                original_filenames.append(original_filename)
                unique_names.append(unique_name)

        # Convert the list of original filenames to a JSON string
        attachment_json = json.dumps(original_filenames)

        with connection.cursor() as cursor:
            # Retrieve the task creator's email
            cursor.execute("SELECT created_by FROM tbltasks WHERE id = %s", (task_id,))
            creator_id = cursor.fetchone()["created_by"]

            cursor.execute("SELECT emailid FROM tblusers WHERE id = %s", (creator_id,))
            creator_email = cursor.fetchone()["emailid"]

            # Retrieve the email of the user replying to the task
            cursor.execute("SELECT emailid FROM tblusers WHERE id = %s", (user_id,))
            replier_email = cursor.fetchone()["emailid"]

            # Call stored procedure to insert or update reply
            cursor.callproc('Proc_tbltasksreplies_UpsertReply', [
                0,  # Assuming 0 means a new reply, adjust if necessary
                task_id,
                description,
                user_id,
                attachment_json,
                unique_names[0] if unique_names else None  # Include the unique name of the first attachment if any
            ])
            connection.commit()

            # Send email notification to the creator and the replier
            send_email_notification_reply(task_id, description, creator_email, replier_email)

        return jsonify({"message": "Reply submitted successfully"}), 201

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

# Function to send email notification about the reply
def send_email_notification_reply(task_id, description, creator_email, replier_email):
    try:


        # Create the email message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = creator_email  # Set task creator's email as main recipient
        msg['Cc'] = replier_email  # Set replier's email in CC
        msg['Subject'] = f"New Reply Submitted for Task ID {task_id}"

        # Add body text
        body = f"A new reply has been added to Task ID: {task_id}.\n\nDescription: {description}"
        msg.attach(MIMEText(body, 'plain'))

        # Create secure connection with server and send the email
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_server, port) as server:
            server.ehlo()  # Optional
            server.starttls(context=context)
            server.ehlo()  # Optional
            server.login(sender_email, password)
            server.sendmail(sender_email, [creator_email, replier_email], msg.as_string())

        print("Email sent successfully to both task creator and replier")
    except Exception as e:
        print(f"Email sending failed: {e}")



@app.route("/api/task/<int:task_id>/replies", methods=["GET"])
@login_required
def get_replies_by_task_id(task_id):
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.callproc("Proc_tbltasksreplies_SelectRepliesByTaskId", (task_id,))
            replies = cursor.fetchall()
            # print("Query Result:", replies)

            # Decode bytes fields to strings, if any
            for reply in replies:
                for key, value in reply.items():
                    if isinstance(value, bytes):
                        reply[key] = value.decode("utf-8")

            return jsonify(replies), 200
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    finally:
        connection.close()


@app.route("/api/task/<int:task_id>/title", methods=["GET"])
def get_task_title(task_id):
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT title FROM tbltickets WHERE id = %s", (task_id,))
            ticket = cursor.fetchone()
            if not ticket:
                return jsonify({"error": "Ticket not found"}), 404
            
            return jsonify({"title": ticket["title"]})

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        connection.close()


@app.route('/api/priority', methods=['GET'])
def get_priority():
    conn = create_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.callproc('Proc_tblpriority_SelectPriorityForDropdown')
            status_options = cursor.fetchall()
            
            # Print raw result for debugging
            # print("Raw result:", status_options)

            return jsonify(status_options), 200

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        conn.close()

@app.route('/api/taskstate', methods=['GET'])
def get_taskstate():
    conn = create_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.callproc('Proc_tbltaskstatus_SelecttaskStatusForDropdown')
            status_options = cursor.fetchall()
            
            # Print raw result for debugging
            # print("Raw result:", status_options)

            return jsonify(status_options), 200

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        conn.close()


# @app.route('/api/update_task_state', methods=['POST'])
# def update_task_state():
#     try:
#         # Get data from the request
#         data = request.json
        
#         # Debugging step: print received data
#         print("Received data:", data)

#         if not data:
#             return jsonify({'error': 'No JSON data provided'}), 400
        
#         task_id = data.get('task_id')
#         taskstatus_id = data.get('taskstatus_id')

#         if not task_id or not taskstatus_id:
#             return jsonify({'error': 'Task ID and Task Status ID are required'}), 400

#         # Open database cursor
#         conn = create_connection()
#         cur = conn.cursor()

#         # Call the stored procedure with correct parameters
#         cur.callproc('Proc_tbltasks_UpdateTaskStatus', [task_id, taskstatus_id])

#         # Commit the transaction
#         conn.commit()

#         # Close cursor
#         cur.close()
#         conn.close()

#         return jsonify({'message': 'Task state updated successfully'}), 200

#     except pymysql.MySQLError as e:
#         # MySQL error handling
#         return jsonify({'error': f"MySQL Error: {str(e)}"}), 500

#     except Exception as e:
#         # Generic error handling
#         return jsonify({'error': f"Error: {str(e)}"}), 500
@app.route('/api/update_task_state', methods=['POST'])
def update_task_state():
    try:
        # Get data from the request
        data = request.json
        print("Received data:", data)

        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        task_id = data.get('ticketId')
        taskstatus_id = data.get('status_id')

        if not task_id or not taskstatus_id:
            return jsonify({'error': 'Task ID and Task Status ID are required'}), 400

        # Open database connection and cursor
        conn = create_connection()
        if conn is None:
            print("Failed to establish a database connection.")
            return jsonify({"error": "Database connection failed"}), 500

        cur = conn.cursor()

        # Call the stored procedure to update task status
        print(f"Updating task status in the database for task_id={task_id} and taskstatus_id={taskstatus_id}")
        cur.callproc('Proc_tbltasks_UpdateTaskStatus', [task_id, taskstatus_id])
        conn.commit()

        # Fetch the assigned user's ID for notification
        # cur.execute("SELECT AssignedTo FROM tbltasks WHERE id = %s", (task_id,))
        # assigned_user_row = cur.fetchone()
        
        # if not assigned_user_row:
        #     print(f"No assigned user found for task_id={task_id}")
        #     return jsonify({"error": "Assigned user not found"}), 404

        # assigned_user_id = assigned_user_row["AssignedTo"]
        # print(f"Assigned user ID: {assigned_user_id}")

        # Fetch assigned user's email
        # cur.execute("SELECT emailid FROM tblusers WHERE id = %s", (assigned_user_id,))
        # assigned_user_email_row = cur.fetchone()

        # if not assigned_user_email_row:
        #     print(f"No email found for assigned user ID: {assigned_user_id}")
        #     return jsonify({"error": "Email for assigned user not found"}), 404

        # assigned_user_email = assigned_user_email_row["emailid"]
        # print(f"Assigned user email: {assigned_user_email}")

        # Close cursor and connection
        cur.close()
        conn.close()

        # Send email notification
        # send_email_notification_task_state_update(task_id, taskstatus_id, assigned_user_email)

        return jsonify({'message': 'Task state updated successfully'}), 200

    except pymysql.MySQLError as e:
        print(f"MySQL Error occurred: {e}")
        return jsonify({'error': f"MySQL Error: {str(e)}"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': f"Error: {str(e)}"}), 500

# Email function to send notification
def send_email_notification_task_state_update(task_id, taskstatus_id, assigned_user_email):
    try:


        # Create the email message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = assigned_user_email  # Send to the assigned user
        msg['Subject'] = f"Task Status Updated for Task ID {task_id}"

        # Add body text
        body = f"The status of Task ID: {task_id} has been updated."
        msg.attach(MIMEText(body, 'plain'))

        # Create secure connection with server and send the email
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_server, port) as server:
            server.ehlo()  # Optional
            server.starttls(context=context)
            server.ehlo()  # Optional
            server.login(sender_email, password)
            server.sendmail(sender_email, assigned_user_email, msg.as_string())

        print("Email sent successfully to assigned user regarding task status update.")
    except Exception as e:
        print(f"Email sending failed: {e}")
    




# @app.route('/api/update_task_priority', methods=['POST'])
# def update_task_priority():
#     try:
#         # Get data from the request
#         data = request.json
        
#         # Debugging step: print received data
#         print("Received data:", data)

#         if not data:
#             return jsonify({'error': 'No JSON data provided'}), 400
        
#         task_id = data.get('task_id')
#         priority_id = data.get('priority_id')

#         if not task_id or not priority_id:
#             return jsonify({'error': 'Task ID and Task Status ID are required'}), 400

#         # Open database cursor
#         conn = create_connection()
#         cur = conn.cursor()

#         # Call the stored procedure with correct parameters
#         cur.callproc('Proc_tbltasks_UpdatePriority', [task_id, priority_id])

#         # Commit the transaction
#         conn.commit()

#         # Close cursor
#         cur.close()
#         conn.close()

#         return jsonify({'message': 'Task state updated successfully'}), 200

#     except pymysql.MySQLError as e:
#         # MySQL error handling
#         return jsonify({'error': f"MySQL Error: {str(e)}"}), 500

#     except Exception as e:
#         # Generic error handling
#         return jsonify({'error': f"Error: {str(e)}"}), 500


@app.route('/api/update_task_priority', methods=['POST'])
def update_task_priority():
    try:
        # Get data from the request
        data = request.json
        print("Received JSON data:", data)

        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        task_id = data.get('ticketId')
        priority_id = data.get('priority_id')

        if not task_id or not priority_id:
            return jsonify({'error': 'Task ID and Priority ID are required'}), 400

        # Open database connection
        conn = create_connection()
        if conn is None:
            print("Failed to establish a database connection.")
            return jsonify({"error": "Database connection failed"}), 500

        cur = conn.cursor()

        # Call the stored procedure to update task priority
        # print(f"Updating task priority in the database for task_id={task_id} and priority_id={priority_id}")
        cur.callproc('Proc_tbltasks_UpdatePriority', [task_id, priority_id])
        conn.commit()

        # # Fetch the assigned user's ID for notification
        # cur.execute("SELECT AssignedTo FROM tbltasks WHERE id = %s", (task_id,))
        # assigned_user_row = cur.fetchone()
        
        # if not assigned_user_row:
        #     print(f"No assigned user found for task_id={task_id}")
        #     return jsonify({"error": "Assigned user not found"}), 404

        # assigned_user_id = assigned_user_row["AssignedTo"]
        # # print(f"Assigned user ID: {assigned_user_id}")

        # # Fetch assigned user's email
        # cur.execute("SELECT emailid FROM tblusers WHERE id = %s", (assigned_user_id,))
        # assigned_user_email_row = cur.fetchone()

        # if not assigned_user_email_row:
        #     print(f"No email found for assigned user ID: {assigned_user_id}")
        #     return jsonify({"error": "Email for assigned user not found"}), 404

        # assigned_user_email = assigned_user_email_row["emailid"]
        # print(f"Assigned user email: {assigned_user_email}")

        # Close cursor and connection
        cur.close()
        conn.close()

        # Send email notification
        # send_email_notification_priority_change(task_id, priority_id, assigned_user_email)

        return jsonify({'message': 'Task priority updated successfully'}), 200

    except pymysql.MySQLError as e:
        print(f"MySQL Error occurred: {e}")
        return jsonify({'error': f"MySQL Error: {str(e)}"}), 500

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': f"Error: {str(e)}"}), 500

# Email function remains the same


# Email notification function for priority change
def send_email_notification_priority_change(task_id, priority_id, assigned_user_email):
    try:


        # Create the email message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = assigned_user_email
        msg['Subject'] = f"Priority Update for Task ID {task_id}"

        # Add body text
        body = f"The priority of Task ID {task_id} has been updated."
        msg.attach(MIMEText(body, 'plain'))

        # Create secure connection with server and send the email
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_server, port) as server:
            server.ehlo()  # Optional
            server.starttls(context=context)
            server.ehlo()  # Optional
            server.login(sender_email, password)
            server.sendmail(sender_email, assigned_user_email, msg.as_string())

        print("Email sent successfully to the assigned user")
    except Exception as e:
        print(f"Email sending failed: {e}")




# @app.route('/api/assign_task', methods=['POST'])
# def assign_task():
#     data = request.json
#     ticket_id = data.get('ticket_id')
#     user_id = data.get('user_id')
#     print("Received data:", data)
#     if not ticket_id or not user_id:
#         return jsonify({"error": "Missing required fields"}), 400

#     connection = create_connection()
#     if connection is None:
#         return jsonify({"error": "Failed to connect to the database"}), 500

#     try:
#         with connection.cursor() as cursor:
#             # Update the assigned user for the ticket
#             cursor.callproc('Proc_tbltasks_UpdateAssignedTo', (ticket_id, user_id))
#             connection.commit()
#             return jsonify({"message": "Ticket assigned successfully"})
            
#     except pymysql.MySQLError as e:
#         print(f"The error '{e}' occurred")
#         return jsonify({"error": "Failed to assign ticket"}), 500
#     finally:
#         connection.close()

# @app.route('/api/assign_task', methods=['POST'])
# def assign_task():
#     data = request.json
#     ticket_id = data.get('ticket_id')
#     user_id = data.get('user_id')
#     print("Received data:", data)
    
#     if not ticket_id or not user_id:
#         return jsonify({"error": "Missing required fields"}), 400

#     connection = create_connection()
#     if connection is None:
#         return jsonify({"error": "Failed to connect to the database"}), 500

#     try:
#         with connection.cursor() as cursor:
#             # Update the assigned user for the ticket
#             cursor.callproc('Proc_tbltasks_UpdateAssignedTo', (ticket_id, user_id))
#             connection.commit()
            
#             # Fetch the assigned user's email
#             cursor.execute("SELECT emailid FROM tblusers WHERE id = %s", (user_id,))
#             assigned_user_email = cursor.fetchone()["emailid"]

#             # Send an email notification to the assigned user
#             send_email_notification_task_assignment(ticket_id, assigned_user_email)

#             return jsonify({"message": "Ticket assigned successfully"})

#     except pymysql.MySQLError as e:
#         print(f"The error '{e}' occurred")
#         return jsonify({"error": "Failed to assign ticket"}), 500
#     finally:
#         connection.close()

@app.route('/api/assign_task', methods=['POST'])
def assign_task():
    data = request.json
    ticket_id = data.get('ticket_id')
    user_ids = data.get('user_ids')  # Expecting a list of user IDs
    # print("Received data:", data)
    
    if not ticket_id or not user_ids or not isinstance(user_ids, list):
        return jsonify({"error": "Missing required fields or invalid format"}), 400

    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            # Iterate over each user ID and assign the ticket to them
            for user_id in user_ids:
                cursor.callproc('Proc_tbltasks_UpdateAssignedTo', (ticket_id, user_id))
                
                # Fetch the assigned user's email
                cursor.execute("SELECT emailid FROM tblusers WHERE id = %s", (user_id,))
                result = cursor.fetchone()
                assigned_user_email = result["emailid"] if result else None

                if assigned_user_email:
                    # Send an email notification to each assigned user
                    send_email_notification_task_assignment(ticket_id, assigned_user_email)
                else:
                    print(f"Email not found for user ID: {user_id}")
            
            # Commit the transaction after all assignments are complete
            connection.commit()
            return jsonify({"message": "Ticket assigned successfully to all specified users"})

    except pymysql.MySQLError as e:
        print(f"Database error occurred: {e}")
        return jsonify({"error": "Failed to assign ticket due to a database error"}), 500
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        connection.close()



def send_email_notification_task_assignment(ticket_id, assigned_user_email):
    try:
       

        # Create the email message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = assigned_user_email
        msg['Subject'] = f"New Task Assigned to You - Task ID {ticket_id}"

        # Add body text
        body = f"A new task with Ticket ID {ticket_id} has been assigned to you. Please check your task dashboard for details."
        msg.attach(MIMEText(body, 'plain'))

        # Create secure connection with server and send the email
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_server, port) as server:
            server.ehlo()  # Optional
            server.starttls(context=context)
            server.ehlo()  # Optional
            server.login(sender_email, password)
            server.sendmail(sender_email, assigned_user_email, msg.as_string())

        print("Email sent successfully to the assigned user")
    except Exception as e:
        print(f"Email sending failed: {e}")



# @app.route('/api/get_assigned_user_for_task/<int:task_id>', methods=['GET'])
# def get_assigned_user_for_task(task_id):
#     # Create database connection
#     connection = create_connection()
#     if connection is None:
#         return jsonify({"error": "Failed to connect to the database"}), 500

#     try:
#         with connection.cursor() as cursor:
#             # Call the stored procedure to fetch the assigned user for the given ticket ID
#             cursor.callproc('Proc_tbltasks_GetAssignedUser', [task_id])
#             result = cursor.fetchone()  # Assuming the stored procedure returns one row
            
#             if result:
#                 return jsonify(result), 200
#             else:
#                 return jsonify({"message": "No user assigned to this ticket"}), 404

#     except pymysql.MySQLError as e:
#         print(f"The error '{e}' occurred")
#         return jsonify({'error': 'Failed to fetch assigned user'}), 500

#     finally:
#         connection.close()

@app.route('/api/get_assigned_user_for_task/<int:task_id>', methods=['GET'])
def get_assigned_user_for_task(task_id):
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            # Call the stored procedure
            cursor.callproc('Proc_tbltasks_GetAssignedUser', [task_id])

            # Fetch ALL results
            result = cursor.fetchall()  # <-- Changed from fetchone() to fetchall()

            if result:
                return jsonify(result), 200
            else:
                return jsonify([]), 200  # Return empty array if no users found

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({'error': 'Failed to fetch assigned users'}), 500

    finally:
        connection.close()


@app.route('/api/get_assigned_state_for_task/<int:task_id>', methods=['GET'])
def get_assigned_state_for_task(task_id):
    # Create database connection
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            # Call the stored procedure to fetch the assigned user for the given ticket ID
            cursor.callproc('Proc_tbltasks_GetTaskStatus', [task_id])
            result = cursor.fetchone()  # Assuming the stored procedure returns one row
            
            if result:
                return jsonify(result), 200
            else:
                return jsonify({"message": "No user assigned to this ticket"}), 404

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({'error': 'Failed to fetch assigned user'}), 500

    finally:
        connection.close()


@app.route('/api/get_assigned_priority_for_task/<int:task_id>', methods=['GET'])
def get_assigned_priority_for_task(task_id):
    # Create database connection
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            # Call the stored procedure to fetch the assigned user for the given ticket ID
            cursor.callproc('Proc_tbltasks_GetPriority', [task_id])
            result = cursor.fetchone()  # Assuming the stored procedure returns one row
            
            if result:
                return jsonify(result), 200
            else:
                return jsonify({"message": "No user assigned to this ticket"}), 404

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({'error': 'Failed to fetch assigned user'}), 500

    finally:
        connection.close()



@app.route('/api/my-task', methods=['GET'])

@login_required
def get_user_task_by_id():
    # Fetch user_id from the session
    user_id = session.get("user_id")
    
    # If user_id is not available, return an error
    if not user_id:
        return jsonify({"error": "User ID not found in session"}), 401
    
    # Create database connection
    connection = create_connection()
    
    # Handle the case where the connection fails
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Call the stored procedure to get the latest 5 opened tickets
            cursor.callproc("Proc_tbltasks_SelectAssignedTasksOfUser", (user_id,))
            
            # Fetch the result from the procedure
            latest_opened_tickets = cursor.fetchall()
            
            # Log the raw result for debugging purposes
            # print("Raw result:", latest_opened_tickets)

            # Decode any bytes to strings if necessary
            for ticket in latest_opened_tickets:
                for key, value in ticket.items():
                    if isinstance(value, bytes):
                        ticket[key] = value.decode("utf-8")

            # Return the tickets as a JSON response
            return jsonify(latest_opened_tickets), 200

    except pymysql.MySQLError as e:
        # Log any MySQL errors for debugging
        print(f"MySQL error occurred: {e}")
        return jsonify({"error": "Database query failed"}), 500

    except Exception as e:
        # Log unexpected errors
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

    finally:
        # Ensure the connection is closed in all cases
        connection.close()



@app.route('/api/created-task', methods=['GET'])
@login_required
def get_task_created_by_me():
    # Fetch user_id from the session
    user_id = session.get("user_id")
    
    # If user_id is not available, return an error
    if not user_id:
        return jsonify({"error": "User ID not found in session"}), 401
    
    # Create database connection
    connection = create_connection()
    
    # Handle the case where the connection fails
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            # Call the stored procedure to get tickets created by the user
            cursor.callproc("Proc_tbltasks_GetTasksCreatedBy", (user_id,))
            
            # Fetch the result from the procedure
            created_tickets = cursor.fetchall()
            
            # Log the raw result for debugging purposes
            # print("Raw result:", created_tickets)

            # Decode any bytes to strings if necessary
            for ticket in created_tickets:
                for key, value in ticket.items():
                    if isinstance(value, bytes):
                        ticket[key] = value.decode("utf-8")

            # Return the tickets as a JSON response
            return jsonify(created_tickets), 200

    except pymysql.MySQLError as e:
        # Log any MySQL errors for debugging
        print(f"MySQL error occurred: {e}")
        return jsonify({"error": "Database query failed"}), 500

    except Exception as e:
        # Log unexpected errors
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

    finally:
        # Ensure the connection is closed in all cases
        connection.close()



@app.route('/api/delete-ticket', methods=['POST'])
def delete_ticket():
    # Extract ticket_id from request
    ticket_id = request.json.get('ticket_id')
    if not ticket_id:
        return jsonify({"error": "Ticket ID is required"}), 400

    # Create database connection
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            # Call the stored procedure to soft delete the ticket
            cursor.callproc('Proc_tbltickets_DeleteTicket', [ticket_id])

            # Commit the changes to the database
            connection.commit()

        return jsonify({"message": "Ticket deleted successfully"}), 200

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": str(e)}), 500

    finally:
        connection.close()


@app.route('/api/delete-task', methods=['POST'])
def delete_task():
    # Extract ticket_id from request
    ticket_id = request.json.get('ticket_id')
    if not ticket_id:
        return jsonify({"error": "Ticket ID is required"}), 400

    # Create database connection
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            # Call the stored procedure to soft delete the ticket
            cursor.callproc('Proc_tbltasks_Deletetask', [ticket_id])

            # Commit the changes to the database
            connection.commit()

        return jsonify({"message": "Ticket deleted successfully"}), 200

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": str(e)}), 500

    finally:
        connection.close()

# Helper function to send email
import requests # type: ignore
@app.route('/proxy', methods=['GET'])
def proxy():
    target_url = request.args.get('url')
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.199 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com',
    }
    session = requests.Session()
    session.headers.update(headers)
    try:
        response = session.get(target_url)
        return Response(
            response.content,
            status=response.status_code,
            content_type=response.headers.get('Content-Type')
        )
    except requests.RequestException as e:
        return Response(
            f"Error fetching the target URL: {str(e)}",
            status=500,
            content_type="text/plain"
        )



@app.route('/api/assign_user_to_task', methods=['POST'])
def assign_user_to_task():
    data = request.json
    task_id = data.get('task_id')
    assigned_to = data.get('assigned_to')

    if not task_id or not assigned_to:
        return jsonify({'success': False, 'error': 'Missing task_id or assigned_to'}), 400

    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO tblTaskAssignments (task_id, AssignedTo) VALUES (%s, %s)",
                (task_id, assigned_to)
            )
            connection.commit()

        return jsonify({'success': True}), 200

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({'success': False, 'error': str(e)}), 500

    finally:
        connection.close()


# @app.route('/api/opened_tasks', methods=['GET'])
# @login_required
# def get_opened_taskss():
#     connection = create_connection()
#     if connection is None:
#         return jsonify({"error": "Database connection failed"}), 500

#     try:
#         with connection.cursor() as cursor:
#             query = """
#                 SELECT 
#                     t.id AS task_id,
#                     t.title,
#                     t.description,
#                     t.created_at,
#                     s.status_name,
#                     p.priority_name,
#                     creator.id AS creator_id,
#                     creator.fname AS creator_fname,
#                     creator.lname AS creator_lname,
#                     creator.role_id AS creator_role,
#                     GROUP_CONCAT(DISTINCT CONCAT(u.fname, ' ', u.lname, '|', u.role_id) SEPARATOR ', ') AS assigned_users
#                 FROM 
#                     tbltasks t
#                 LEFT JOIN 
#                     tbltaskstatus s ON t.taskstatus_id = s.id
#                 LEFT JOIN 
#                     tblpriority p ON t.priority_id = p.id
#                 LEFT JOIN 
#                     tblusers creator ON t.created_by = creator.id
#                 LEFT JOIN 
#                     tblTaskAssignments ta ON t.id = ta.task_id
#                 LEFT JOIN 
#                     tblusers u ON ta.AssignedTo = u.id
#                 WHERE 
#                     t.taskstatus_id != 4
#                 GROUP BY 
#                     t.id
#                     ORDER BY 
#                         t.id DESC;
#             """
#             cursor.execute(query)
#             tasks = cursor.fetchall()

#             # Process each task
#             result = []
#             for task in tasks:
#                 assigned_users = []
#                 if task['assigned_users']:
#                     for user_str in task['assigned_users'].split(', '):
#                         user_info = user_str.split('|')
#                         if len(user_info) == 2:
#                             fname, lname = user_info[0].split(' ', 1)
#                             assigned_users.append({
#                                 "fname": fname,
#                                 "lname": lname,
#                                 "role": user_info[1]
#                             })

#                 result.append({
#                     "task_id": task['task_id'],
#                     "title": task['title'],
#                     "description": task['description'],
#                     "created_at": task['created_at'],
#                     "status_name": task['status_name'],
#                     "priority_name": task['priority_name'],
#                     "creator": {
#                         "fname": task['creator_fname'],
#                         "lname": task['creator_lname'],
#                         "role": task['creator_role']
#                     },
#                     "assigned_users": assigned_users
#                 })

#             return jsonify(result), 200

#     except pymysql.MySQLError as e:
#         print(f"Database error: {e}")
#         return jsonify({"error": "Failed to fetch tasks"}), 500

#     finally:
#         connection.close()



# @app.route('/api/opened_tasks', methods=['GET'])
# @login_required
# def get_opened_taskss():
#     user_id = session.get("user_id")
#     if not user_id:
#         return jsonify({"error": "User not logged in"}), 401

#     connection = create_connection()
#     if connection is None:
#         return jsonify({"error": "Database connection failed"}), 500

#     try:
#         with connection.cursor() as cursor:
#             # Get current user's role
#             cursor.execute("SELECT role_id FROM tblusers WHERE id = %s", [user_id])
#             user_row = cursor.fetchone()
#             if not user_row:
#                 return jsonify({"error": "User not found"}), 404
#             user_role = int(user_row['role_id'])

#             # Fetch all tasks with full details
#             query = """
#                 SELECT 
#                     t.id AS task_id,
#                     t.title,
#                     t.description,
#                     t.created_at,
#                     s.status_name,
#                     p.priority_name,
#                     creator.id AS creator_id,
#                     creator.fname AS creator_fname,
#                     creator.lname AS creator_lname,
#                     creator.role_id AS creator_role,
#                     GROUP_CONCAT(
#                         DISTINCT CONCAT(u.id, '|', u.fname, ' ', u.lname, '|', u.role_id)
#                         SEPARATOR ', '
#                     ) AS assigned_users_raw
#                 FROM 
#                     tbltasks t
#                 LEFT JOIN 
#                     tbltaskstatus s ON t.taskstatus_id = s.id
#                 LEFT JOIN 
#                     tblpriority p ON t.priority_id = p.id
#                 LEFT JOIN 
#                     tblusers creator ON t.created_by = creator.id
#                 LEFT JOIN 
#                     tblTaskAssignments ta ON t.id = ta.task_id
#                 LEFT JOIN 
#                     tblusers u ON ta.AssignedTo = u.id
#                 WHERE 
#                     t.taskstatus_id != 4
#                 GROUP BY 
#                     t.id
#                 ORDER BY 
#                     t.id DESC;
#             """
#             cursor.execute(query)
#             tasks = cursor.fetchall()

#             result = []

#             for task in tasks:
#                 # Parse assigned users
#                 assigned_users = []
#                 has_non_role_1_assigned = False
#                 assigned_user_ids = set()

#                 if task['assigned_users_raw']:
#                     for item in task['assigned_users_raw'].split(', '):
#                         parts = item.split('|', 2)
#                         if len(parts) == 3:
#                             uid_str, name, role_str = parts
#                             try:
#                                 uid = int(uid_str)
#                                 role = int(role_str)
#                                 assigned_users.append({
#                                     "id": uid,
#                                     "fname": name.split()[0],
#                                     "lname": " ".join(name.split()[1:]) if len(name.split()) > 1 else "",
#                                     "role": role
#                                 })
#                                 assigned_user_ids.add(uid)
#                                 if role != 1:
#                                     has_non_role_1_assigned = True
#                             except (ValueError, IndexError):
#                                 continue

#                 creator_id = task['creator_id']
#                 creator_role = int(task['creator_role']) if task['creator_role'] else 1

#                 visible = False

#                 if user_role in [2, 4]:
#                     # Can only see own created or assigned tasks
#                     if user_id == creator_id or user_id in assigned_user_ids:
#                         visible = True

#                 elif user_role == 3:
#                     # Can see all tasks except those fully internal to role 1 (unless assigned)
#                     if creator_role != 1 or user_id in assigned_user_ids:
#                         visible = True

#                 elif user_role == 1:
#                     # Rule: Only hidden if:
#                     # - Creator is role 1 AND all assigned users are role 1 → then only visible to creator & assigned
#                     # Else → visible to all role 1 users
#                     if creator_role == 1 and not has_non_role_1_assigned:
#                         # Fully internal role-1 task → only visible to creator and assigned
#                         if user_id == creator_id or user_id in assigned_user_ids:
#                             visible = True
#                     else:
#                         # Either creator ≠ role 1 OR someone non-role-1 is involved → visible to ALL role 1
#                         visible = True

#                 if visible:
#                     result.append({
#                         "task_id": task['task_id'],
#                         "title": task['title'],
#                         "description": task['description'],
#                         "created_at": task['created_at'],
#                         "status_name": task['status_name'],
#                         "priority_name": task['priority_name'],
#                         "creator": {
#                             "fname": task['creator_fname'],
#                             "lname": task['creator_lname'],
#                             "role": creator_role
#                         },
#                         "assigned_users": assigned_users
#                     })

#             return jsonify(result), 200

#     except Exception as e:
#         print(f"Error fetching opened tasks: {e}")
#         return jsonify({"error": "Failed to fetch tasks"}), 500

#     finally:
#         connection.close()



# @app.route('/api/opened_tasks', methods=['GET'])
# @login_required
# def get_opened_taskss():
#     user_id = session.get("user_id")
#     if not user_id:
#         return jsonify({"error": "User not logged in"}), 401

#     connection = create_connection()
#     if connection is None:
#         return jsonify({"error": "Database connection failed"}), 500

#     try:
#         with connection.cursor() as cursor:
#             # Get current user's role
#             cursor.execute("SELECT role_id FROM tblusers WHERE id = %s", [user_id])
#             user_row = cursor.fetchone()
#             if not user_row:
#                 return jsonify({"error": "User not found"}), 404
#             try:
#                 user_role = int(user_row['role_id'])
#             except (ValueError, TypeError):
#                 return jsonify({"error": "Invalid role"}), 500

#             # Fetch all tasks with full details
#             query = """
#                 SELECT 
#                     t.id AS task_id,
#                     t.title,
#                     t.description,
#                     t.created_at,
#                     s.status_name,
#                     p.priority_name,
#                     creator.id AS creator_id,
#                     creator.fname AS creator_fname,
#                     creator.lname AS creator_lname,
#                     creator.role_id AS creator_role,
#                     GROUP_CONCAT(
#                         DISTINCT CONCAT(u.id, '|', u.fname, ' ', u.lname, '|', u.role_id)
#                         SEPARATOR ', '
#                     ) AS assigned_users_raw
#                 FROM 
#                     tbltasks t
#                 LEFT JOIN 
#                     tbltaskstatus s ON t.taskstatus_id = s.id
#                 LEFT JOIN 
#                     tblpriority p ON t.priority_id = p.id
#                 LEFT JOIN 
#                     tblusers creator ON t.created_by = creator.id
#                 LEFT JOIN 
#                     tblTaskAssignments ta ON t.id = ta.task_id
#                 LEFT JOIN 
#                     tblusers u ON ta.AssignedTo = u.id
#                 WHERE 
#                     t.taskstatus_id != 4
#                 GROUP BY 
#                     t.id
#                 ORDER BY 
#                     t.id DESC;
#             """
#             cursor.execute(query)
#             tasks = cursor.fetchall()

#             result = []

#             for task in tasks:
#                 # Parse assigned users
#                 assigned_users = []
#                 has_non_role_1_assigned = False
#                 assigned_user_ids = set()

#                 if task['assigned_users_raw']:
#                     for item in task['assigned_users_raw'].split(', '):
#                         parts = item.split('|', 2)
#                         if len(parts) == 3:
#                             try:
#                                 uid = int(parts[0])
#                                 name = parts[1]
#                                 role = int(parts[2])
#                                 assigned_users.append({
#                                     "id": uid,
#                                     "fname": name.split()[0],
#                                     "lname": " ".join(name.split()[1:]) if len(name.split()) > 1 else "",
#                                     "role": role
#                                 })
#                                 assigned_user_ids.add(uid)
#                                 if role != 1:
#                                     has_non_role_1_assigned = True
#                             except (ValueError, IndexError):
#                                 continue

#                 creator_id = task['creator_id']
#                 creator_role = int(task['creator_role']) if task['creator_role'] else 1

#                 visible = False

#                 # === Role-Based Access Control ===
#                 if user_role == 1:
#                     # Fully internal role-1 task? Only visible to participants
#                     if creator_role == 1 and not has_non_role_1_assigned:
#                         if user_id == creator_id or user_id in assigned_user_ids:
#                             visible = True
#                     else:
#                         # Otherwise, visible to all role 1 users
#                         visible = True

#                 elif user_role in [2, 4]:
#                     # Can only see own created or assigned tasks
#                     if user_id == creator_id or user_id in assigned_user_ids:
#                         visible = True

#                 elif user_role == 3:
#                     # Can see all tasks except fully internal role-1 ones (unless assigned)
#                     if creator_role != 1 or user_id in assigned_user_ids:
#                         visible = True

#                 else:
#                     # 🔐 Fallback Rule: Unknown or new role (e.g., 5, 6, ...)
#                     # Only allow access if user is creator or assigned
#                     if user_id == creator_id or user_id in assigned_user_ids:
#                         visible = True
#                     # Else: no access

#                 if visible:
#                     result.append({
#                         "task_id": task['task_id'],
#                         "title": task['title'],
#                         "description": task['description'],
#                         "created_at": task['created_at'],
#                         "status_name": task['status_name'],
#                         "priority_name": task['priority_name'],
#                         "creator": {
#                             "fname": task['creator_fname'],
#                             "lname": task['creator_lname'],
#                             "role": creator_role
#                         },
#                         "assigned_users": assigned_users
#                     })

#             return jsonify(result), 200

#     except Exception as e:
#         print(f"Error fetching opened tasks: {e}")
#         return jsonify({"error": "Failed to fetch tasks"}), 500

#     finally:
#         connection.close()

@app.route('/api/opened_tasks', methods=['GET'])
@login_required
def get_opened_taskss():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        with connection.cursor() as cursor:
            # Get current user's role
            cursor.execute("SELECT role_id FROM tblusers WHERE id = %s", [user_id])
            user_row = cursor.fetchone()
            if not user_row:
                return jsonify({"error": "User not found"}), 404

            try:
                user_role = int(user_row['role_id'])
            except (ValueError, TypeError):
                return jsonify({"error": "Invalid role"}), 500

            # ⬇️ Updated Query with tag support
            query = """
                SELECT 
                    t.id AS task_id,
                    t.title,
                    t.description,
                    t.created_at,
                    s.status_name,
                    p.priority_name,
                    creator.id AS creator_id,
                    creator.fname AS creator_fname,
                    creator.lname AS creator_lname,
                    creator.role_id AS creator_role,
                    GROUP_CONCAT(
                        DISTINCT CONCAT(u.id, '|', u.fname, ' ', u.lname, '|', u.role_id)
                        SEPARATOR ', '
                    ) AS assigned_users_raw,
                    GROUP_CONCAT(
                        DISTINCT tg.tag 
                        ORDER BY tg.tag 
                        SEPARATOR ', '
                    ) AS task_tags
                FROM 
                    tbltasks t
                LEFT JOIN 
                    tbltaskstatus s ON t.taskstatus_id = s.id
                LEFT JOIN 
                    tblpriority p ON t.priority_id = p.id
                LEFT JOIN 
                    tblusers creator ON t.created_by = creator.id
                LEFT JOIN 
                    tblTaskAssignments ta ON t.id = ta.task_id
                LEFT JOIN 
                    tblusers u ON ta.AssignedTo = u.id
                LEFT JOIN 
                    tags tg ON FIND_IN_SET(tg.id, t.tags) > 0
                WHERE 
                    t.taskstatus_id != 4
                GROUP BY 
                    t.id
                ORDER BY 
                    t.id DESC;
            """
            cursor.execute(query)
            tasks = cursor.fetchall()

            result = []

            for task in tasks:
                assigned_users = []
                has_non_role_1_assigned = False
                assigned_user_ids = set()

                if task['assigned_users_raw']:
                    for item in task['assigned_users_raw'].split(', '):
                        parts = item.split('|', 2)
                        if len(parts) == 3:
                            try:
                                uid = int(parts[0])
                                name = parts[1]
                                role = int(parts[2])
                                assigned_users.append({
                                    "id": uid,
                                    "fname": name.split()[0],
                                    "lname": " ".join(name.split()[1:]) if len(name.split()) > 1 else "",
                                    "role": role
                                })
                                assigned_user_ids.add(uid)
                                if role != 1:
                                    has_non_role_1_assigned = True
                            except (ValueError, IndexError):
                                continue

                creator_id = task['creator_id']
                creator_role = int(task['creator_role']) if task['creator_role'] else 1

                visible = False

                # Role-Based Visibility
                if user_role == 1:
                    if creator_role == 1 and not has_non_role_1_assigned:
                        if user_id == creator_id or user_id in assigned_user_ids:
                            visible = True
                    else:
                        visible = True
                elif user_role in [2, 4]:
                    if user_id == creator_id or user_id in assigned_user_ids:
                        visible = True
                elif user_role == 3:
                    if creator_role != 1 or user_id in assigned_user_ids:
                        visible = True
                else:
                    if user_id == creator_id or user_id in assigned_user_ids:
                        visible = True

                if visible:
                    result.append({
                        "task_id": task['task_id'],
                        "title": task['title'],
                        "description": task['description'],
                        "created_at": task['created_at'],
                        "status_name": task['status_name'],
                        "priority_name": task['priority_name'],
                        "task_tags": task.get("task_tags", ""),
                        "creator": {
                            "fname": task['creator_fname'],
                            "lname": task['creator_lname'],
                            "role": creator_role
                        },
                        "assigned_users": assigned_users
                    })

            return jsonify(result), 200

    except Exception as e:
        print(f"Error fetching opened tasks: {e}")
        return jsonify({"error": "Failed to fetch tasks"}), 500

    finally:
        connection.close()


@app.route('/api/tags', methods=['GET'])
def get_tags():
    connection = create_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, tag FROM tags ORDER BY tag")
            result = cursor.fetchall()
            return jsonify(result), 200
    except Exception as e:
        print(e)
        return jsonify([]), 500
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=8080)




#Hello this is the the 





