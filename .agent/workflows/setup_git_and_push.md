---
description: How to initialize a local project and push to a new GitHub branch
---

This workflow guides you through setting up a local folder as a Git repository and pushing it to a new branch on GitHub.

1.  **Initialize Git**
    Open Git Bash in your project folder (`itshop-main`) and run:
    ```bash
    git init
    ```

2.  **Add all files**
    Stage all your current files for the first commit:
    ```bash
    git add .
    ```

3.  **Commit changes**
    Save your changes locally:
    ```bash
    git commit -m "Initial commit"
    ```

4.  **Add Remote Repository**
    Link your local folder to your GitHub repository (replace URL with your actual repo URL if different):
    ```bash
    git remote add origin https://github.com/ndeso17/itshop.git
    ```
    *(Note: If it says "remote origin already exists", you can skip this or use `git remote set-url origin ...`)*

5.  **Create and Switch to New Branch**
    Create your new branch (e.g., `fitur-baru`):
    ```bash
    git checkout -b fitur-baru
    ```

6.  **Push to GitHub**
    Upload your branch to GitHub:
    ```bash
    git push -u origin fitur-baru
    ```

Success! Your new branch is now on GitHub.
