# Demo express.js with mariadb connection

## run database using the following command

```bash
docker run --name my-mariadb -e MYSQL_ROOT_PASSWORD=bth013 -e MYSQL_DATABASE=demo -e MYSQL_USER=bth013 -e MYSQL_PASSWORD=foobar -p 3306:3306 -d mariadb
```
** See [more info on database](DATABASE.md)**

## NOTE on password security

This demo is breaking a number of security rules for programmers. It's ok because it is a demo. Barely.
But you must not handle passwords, tokens or API keys like this!

From a security and secrets management perspective, passwords, tokens and API keys are the same. They are all used to grant the holder access to services and data.

For developers, follow these rules when handling passwords:

- DO NOT EVER type the password as part of the command line prompt
  * It's will be logged in the cli history in clear text and easy to access for an attacker
  * Instead put it in an environment variable using the following command to read interactively from the STDIN (and avoiding logging in cli history):
    ```bash
    read -sp "Password: " SERVER_PWD
    ```
- DO NOT EVER paste the password into a webform (like chat-gpt, or any other form) as it will be a secret anymore.
- DO NOT EVER put a password in a file and check it into a git repository (or anyother code repository)
  * use a secrets management solution (Like keychain on Mac or similar)
  * for automatic build pipelines, use the provided secrets management in the solution you use, e.g. Github secrets
- DO NOT EVER put the credentials (username or password) in the code, neither in clear text, nor in BASE64 (which is not an encryption, only an encoding) or anyother shape or form.
- DO NOT EVER send username and password together as the interception of the single message is enough to get access.