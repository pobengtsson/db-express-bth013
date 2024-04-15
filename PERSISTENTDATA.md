# Persist data between container restarts

Using Docker volumes is a great way to ensure that your data persists even when you restart or remove your container. A Docker volume allows data to be stored in a part of the filesystem that's managed by Docker and is independent of the container's lifecycle. Here’s how you can use a Docker volume with your MariaDB container:

### Step 1: Create a Docker Volume
First, you need to create a Docker volume. This command creates a new volume named `mariadb_data`:

```bash
docker volume create mariadb_data
```

### Step 2: Run MariaDB with the Volume Attached
Now, you need to start your MariaDB container with this volume attached. The volume will be used to store the database files, ensuring they persist beyond the life of the container. Modify the `docker run` command to include the volume:

```bash
docker run --name my-mariadb \
  -e MYSQL_ROOT_PASSWORD=foobar \
  -e MYSQL_DATABASE=demo \
  -e MYSQL_USER=bth013 \
  -e MYSQL_PASSWORD=foobar \
  -p 3306:3306 \
  -v mariadb_data:/var/lib/mysql \
  -d mariadb
```

Here’s what’s added/changed:
- `-v mariadb_data:/var/lib/mysql`: This mounts the `mariadb_data` volume at `/var/lib/mysql`, which is the directory where MariaDB stores its data files.

### Step 3: Verify the Volume is in Use
After the container is running, you can verify that the volume is attached and in use:

```bash
docker volume ls
```

You should see `mariadb_data` listed. You can also inspect the volume to see more details about it:

```bash
docker volume inspect mariadb_data
```

### Step 4: Managing the Volume
The data in this volume will persist across container restarts and even if you delete the container. If you ever need to remove the volume (and all the data within it), you can do so with:

```bash
docker volume rm mariadb_data
```

**Note:** Be very careful with this command as it will permanently delete the volume and all the data stored within it, which cannot be recovered unless you have backups.

### Additional Considerations
- **Backups:** Even with data persistence through volumes, regular backups are essential for protecting your data against accidental deletion or corruption.
- **Data Migration:** If you need to move data between machines or environments, you can look into Docker's volume copying techniques or export/import the database using MariaDB's native tools.

By using a Docker volume with your MariaDB container, you ensure that your database data remains safe across container restarts, making your database setup more robust and reliable.
