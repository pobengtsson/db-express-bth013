# Running Mariadb with docker

Here's info on how you can run mariadb as a container for this example.
For a real project, for other options when developing and for production, please consult the Docker *and* MariaDb documentation.

### Step 1: Start the MariaDB Container
You can start a MariaDB container with Docker by using the `docker run` command. This command will create a new container and set up the initial user, password, and database. Here's how to do it:

```bash
docker run --name my-mariadb -e MYSQL_ROOT_PASSWORD=bth013 -e MYSQL_DATABASE=demo -e MYSQL_USER=bth013 -e MYSQL_PASSWORD=foobar -p 3306:3306 -d mariadb
```

Here's what each part of the command does:
- `--name my-mariadb`: Names the container `my-mariadb`.
- `-e MYSQL_ROOT_PASSWORD=myrootpassword`: Sets the root password to `myrootpassword`. Change `myrootpassword` to a secure password of your choice.
- `-e MYSQL_DATABASE=myappdb`: Creates a database named `myappdb`.
- `-e MYSQL_USER=appuser`: Creates a user named `appuser`.
- `-e MYSQL_PASSWORD=securepassword`: Sets the password for `appuser` to `securepassword`. Change `securepassword` to a secure password of your choice.
- `-p 3306:3306`: Maps port 3306 on the host to port 3306 on the container, allowing you to connect to the database from your host machine.
- `-d mariadb`: Specifies the image to use (`mariadb`) and runs the container in detached mode.

### Step 2: Verify the Container is Running
Check if your MariaDB container is running:

```bash
docker ps
```

### Step 3: Connect to MariaDB in the Container
You can connect to the MariaDB database running inside the container using any MySQL client from your host machine. For example, you can use the MySQL command-line tool:

```bash
mysql -h 127.0.0.1 -P 3306 -u bth013 -p -U demo
```

When prompted, enter the password (`securepassword` in the setup).

### Step 4: Creating the Users Table
Once connected, you might want to create the `users` table as described in the earlier step. Use the following SQL command inside your MySQL client:

```sql
USE myappdb;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);
```

### Step 5: Using the Database with Your Application
With your MariaDB container running and configured, update your Express.js application's database connection settings to match these credentials and host details (`localhost` and port `3306`).

Now, your MariaDB instance is ready in a Docker container, and you can begin using it with your application. This setup ensures that your database environment is portable and easily replicable, which can be particularly useful for development and testing.
