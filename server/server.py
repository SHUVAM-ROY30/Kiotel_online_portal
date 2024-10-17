from ssl import SSLError
from flask import Flask, request, jsonify, session
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

from werkzeug.utils import secure_filename






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

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("login_user"))
        return f(*args, **kwargs)
    return decorated_function



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
            cursor.callproc('Proc_tblUsers_CheckCredentials', (email, password, 0))
            cursor.execute("SELECT @_Proc_tblUsers_CheckCredentials_2")
            result = cursor.fetchone()
            credentials_valid = result.get('@_Proc_tblUsers_CheckCredentials_2')

            if credentials_valid == 1:
                cursor.execute("SELECT * FROM tblusers WHERE emailid = %s", (email,))
                user = cursor.fetchone()
                session["user_id"] = user['id']
                session.permanent = True  # Make the session permanent (cookie won't be deleted after the browser is closed)
                return jsonify({
                    "id": user['id'],
                    "email": user['emailid']
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
                return jsonify({"name": user['fname'], "role": user["role_id"]})
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
#     user_id = data.get("id", 0)  # Get the user ID; default to 0 for new users
#     email = data["email"]
#     password = data["password"]
#     fname = data.get("fname")
#     lname = data.get("lname")
#     dob = data.get("dob")
#     address = data.get("address")
#     account_no = data.get("account_no")
#     mobileno = data.get("mobileno")
#     role_id = data.get("role_id", 2)  # Default role_id is 2

#     connection = create_connection()
#     if connection is None:
#         return jsonify({"error": "Failed to connect to the database"}), 500

#     try:
#         with connection.cursor() as cursor:
#             # If user_id > 0, update the user; otherwise, insert a new user
#             cursor.callproc('Proc_tblusers_Upsert', (user_id, email, password, fname, lname, dob, address, account_no, mobileno, role_id))
#             connection.commit()

#             # Fetch the user (whether newly created or updated)
#             cursor.execute("SELECT * FROM tblusers WHERE emailid = %s", (email,))
#             user = cursor.fetchone()

#             session["user_id"] = user['id']
#             session.permanent = True  # Make the session permanent

#             return jsonify({
#                 "id": user['id'],
#                 "email": user['emailid']
#             })
#     except pymysql.MySQLError as e:
#         print(f"The error '{e}' occurred")
#         return jsonify({"error": "Database query failed"}), 500
#     finally:
#         connection.close()


@app.route("/api/register", methods=["POST"])
def register_user():
    data = request.json
    email = data["email"]
    password = data["password"]
    fname = data.get("fname")
    lname = data.get("lname")
    dob = data.get("dob")
    address = data.get("address")
    account_no = data.get("account_no")
    mobileno = data.get("mobileno")
    role_id = data.get("role_id", 2)  # Default role_id is 2

    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            # Check if the user with the given email already exists
            cursor.execute("SELECT id FROM tblusers WHERE emailid = %s", (email,))
            existing_user = cursor.fetchone()

            if existing_user:
                # If user exists, return a message to the frontend
                return jsonify({"message": "User with this email already exists"}), 409

            # If user does not exist, insert a new user
            user_id = 0  # For a new user
            cursor.callproc('Proc_tblusers_Upsert', (user_id, email, password, fname, lname, dob, address, account_no, mobileno, role_id))
            connection.commit()

            # Fetch the newly created user
            cursor.execute("SELECT * FROM tblusers WHERE emailid = %s", (email,))
            user = cursor.fetchone()

            session["user_id"] = user['id']
            session.permanent = True  # Make the session permanent

            return jsonify({
                "id": user['id'],
                "email": user['emailid']
            })
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    finally:
        connection.close()


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
            print("Raw result:", opened_tickets)

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
            print("Raw result:", latest_opened_tickets)

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
            print("Raw result:", closed_tickets)

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

@app.route("/api/ticket", methods=["POST"])
@login_required
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
            if attachments:
                for attachment in attachments:
                    original_filename = attachment.filename
                    
                    # Generate unique encrypted name for the file
                    unique_name = generate_unique_name(original_filename)
                    
                    # Save the file on the server with the unique encrypted name
                    file_path = os.path.join(upload_folder, unique_name)
                    attachment.save(file_path)
                    
                    # Store only the original filename
                    attachment_filenames.append(original_filename)

            # Convert attachment filenames to JSON format
            attachments_json = json.dumps(attachment_filenames)

            # Set the session variable for the current user ID
            cursor.execute("SET @current_user_id = %s", (user_id,))

            # Set status_id to 1 (assumed 'Open' status)
            status_id = 1

            # Call the stored procedure with the parameters, including the attachments JSON and status_id
            cursor.callproc('Proc_tbltickets_UpsertTicket', (0, title, description, attachments_json, unique_name if attachments else None, status_id))
            connection.commit()

            # Fetch the last inserted ticket ID
            cursor.execute("SELECT LAST_INSERT_ID() AS ticket_id")
            ticket_id = cursor.fetchone()["ticket_id"]

            return jsonify({"message": "Ticket created successfully", "ticket_id": ticket_id}), 201
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()


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
            print("Query Result:", result)

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
            print("Raw result:", status_options)

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
            print("Raw result:", roles_options)

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

        return jsonify({"message": "Reply submitted successfully"}), 201

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()



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
            print("Query Result:", replies)

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



@app.route('/api/users', methods=['GET'])
def get_users():
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Call the stored procedure to get the list of all users
            cursor.callproc('Proc_tblusers_displaylistofusers')
            users = cursor.fetchall()  # Fetch all results
            
            if not users:
                return jsonify({"error": "No users found"}), 404

            # Convert the result to a list of dictionaries
            users_list = []
            for user in users:
                users_list.append({
                    "id": user['id'],
                    "fname": user['fname'],
                    "lname": user['lname'],
                    "emailid": user['emailid'],
                    "role": user['role'],
                    # Add other fields as necessary
                })

            return jsonify(users_list)
            
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
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
            return jsonify({"message": "Ticket assigned successfully"})
            
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Failed to assign ticket"}), 500
    finally:
        connection.close()




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
            print("Raw result:", latest_opened_tickets)

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
            print("Raw result:", created_tickets)

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
@app.route('/api/submit', methods=['POST'])
def hotel_information():
    data = request.json

    # Extract data from the request
    p_id = data.get('id', 0)
    p_date_submitted = data.get('date_submitted')
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
            p_additionalInformation
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




#test
# @app.route('/save-test', methods=['POST'])
# def save_test():
#     data = request.get_json()

#     is_yes = data.get('isYes', 0)
#     is_no = data.get('isNo', 0)
#     is_other = data.get('isOther', 0)
#     other_text = data.get('otherText', None)

#     try:
#         connection = create_connection()
#         cursor = connection.cursor()
#         query = """
#             INSERT INTO test (IsYes, IsNo, IsOther, otherText)
#             VALUES (%s, %s, %s, %s)
#         """
#         cursor.execute(query, (is_yes, is_no, is_other, other_text))
#         connection.commit()  # Commit using the connection object

#         return jsonify({'message': 'Test record saved successfully.'}), 201

#     except Exception as e:
#         return jsonify({'message': 'Failed to save test record.', 'error': str(e)}), 500

#     finally:
#         cursor.close()
#         connection.close()


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
    try:
        # Extract the form data
        form_data = request.form

        p_id = form_data.get('id', 0)
        p_firstname = form_data.get('firstName')
        p_lastname = form_data.get('lastName')
        p_propertyName = form_data.get('propertyName')
        p_address = form_data.get('address')
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
        
        cursor.callproc('Proc_tblthirdpartyequipment_Upsert', [
            p_id, p_firstname, p_lastname, p_propertyName, p_address, p_city, p_state, p_zipCode,
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
            print("Raw result:", roles_options)

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
            print("Raw result:", roles_options)

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


@app.route("/api/task", methods=["POST"])
@login_required
def create_task():
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
            if attachments:
                for attachment in attachments:
                    original_filename = attachment.filename
                    
                    # Generate unique encrypted name for the file
                    unique_name = generate_unique_name(original_filename)
                    
                    # Save the file on the server with the unique encrypted name
                    file_path = os.path.join(upload_folder, unique_name)
                    attachment.save(file_path)
                    
                    # Store only the original filename
                    attachment_filenames.append(original_filename)

            # Convert attachment filenames to JSON format
            attachments_json = json.dumps(attachment_filenames)

            # Set the session variable for the current user ID
            cursor.execute("SET @current_user_id = %s", (user_id,))

            # Set status_id to 1 (assumed 'Open' status)
            status_id = 1

            # Call the stored procedure with the parameters, including the attachments JSON and status_id
            cursor.callproc('Proc_tbltasks_Upsert', (0, title, description, attachments_json, unique_name if attachments else None, status_id))
            connection.commit()

            # Fetch the last inserted ticket ID
            cursor.execute("SELECT LAST_INSERT_ID() AS ticket_id")
            ticket_id = cursor.fetchone()["ticket_id"]

            return jsonify({"message": "Ticket created successfully", "ticket_id": ticket_id}), 201
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()



@app.route("/api/opened_task", methods=["GET"])
@login_required
def get_opened_tasks():
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Call the stored procedure
            cursor.callproc("Proc_tbltasks_DisplayOpenedtasks")
            
            # Fetch the result
            opened_tickets = cursor.fetchall()
            
            # Print raw result for debugging
            print("Raw result:", opened_tickets)

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
            print("Query Result:", result)

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
        # status_id = int(request.form.get("status_id", 1))  # Convert to integer and default to 1 if missing

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
            cursor.callproc('Proc_tbltasksreplies_UpsertReply', [
                0,  # Assuming 0 means a new reply, adjust if necessary
                task_id,
                description,
                user_id,
                # status_id,
                attachment_json,
                unique_names[0] if unique_names else None  # Include the unique name of the first attachment if any
            ])
            connection.commit()

        return jsonify({"message": "Reply submitted successfully"}), 201

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()



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
            print("Query Result:", replies)

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
            print("Raw result:", status_options)

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
            print("Raw result:", status_options)

            return jsonify(status_options), 200

    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Database query failed"}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        conn.close()


@app.route('/api/update_task_state', methods=['POST'])
def update_task_state():
    try:
        # Get data from the request
        data = request.json
        
        # Debugging step: print received data
        print("Received data:", data)

        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        task_id = data.get('task_id')
        taskstatus_id = data.get('taskstatus_id')

        if not task_id or not taskstatus_id:
            return jsonify({'error': 'Task ID and Task Status ID are required'}), 400

        # Open database cursor
        conn = create_connection()
        cur = conn.cursor()

        # Call the stored procedure with correct parameters
        cur.callproc('Proc_tbltasks_UpdateTaskStatus', [task_id, taskstatus_id])

        # Commit the transaction
        conn.commit()

        # Close cursor
        cur.close()
        conn.close()

        return jsonify({'message': 'Task state updated successfully'}), 200

    except pymysql.MySQLError as e:
        # MySQL error handling
        return jsonify({'error': f"MySQL Error: {str(e)}"}), 500

    except Exception as e:
        # Generic error handling
        return jsonify({'error': f"Error: {str(e)}"}), 500
    
@app.route('/api/update_task_priority', methods=['POST'])
def update_task_priority():
    try:
        # Get data from the request
        data = request.json
        
        # Debugging step: print received data
        print("Received data:", data)

        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        task_id = data.get('task_id')
        priority_id = data.get('priority_id')

        if not task_id or not priority_id:
            return jsonify({'error': 'Task ID and Task Status ID are required'}), 400

        # Open database cursor
        conn = create_connection()
        cur = conn.cursor()

        # Call the stored procedure with correct parameters
        cur.callproc('Proc_tbltasks_UpdatePriority', [task_id, priority_id])

        # Commit the transaction
        conn.commit()

        # Close cursor
        cur.close()
        conn.close()

        return jsonify({'message': 'Task state updated successfully'}), 200

    except pymysql.MySQLError as e:
        # MySQL error handling
        return jsonify({'error': f"MySQL Error: {str(e)}"}), 500

    except Exception as e:
        # Generic error handling
        return jsonify({'error': f"Error: {str(e)}"}), 500

@app.route('/api/assign_task', methods=['POST'])
def assign_task():
    data = request.json
    ticket_id = data.get('ticket_id')
    user_id = data.get('user_id')
    print("Received data:", data)
    if not ticket_id or not user_id:
        return jsonify({"error": "Missing required fields"}), 400

    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            # Update the assigned user for the ticket
            cursor.callproc('Proc_tbltasks_UpdateAssignedTo', (ticket_id, user_id))
            connection.commit()
            return jsonify({"message": "Ticket assigned successfully"})
            
    except pymysql.MySQLError as e:
        print(f"The error '{e}' occurred")
        return jsonify({"error": "Failed to assign ticket"}), 500
    finally:
        connection.close()


@app.route('/api/get_assigned_user_for_task/<int:task_id>', methods=['GET'])
def get_assigned_user_for_task(task_id):
    # Create database connection
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        with connection.cursor() as cursor:
            # Call the stored procedure to fetch the assigned user for the given ticket ID
            cursor.callproc('Proc_tbltasks_GetAssignedUser', [task_id])
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



if __name__ == '__main__':
    app.run(debug=True, port=8080)




#Hello this is the the 



