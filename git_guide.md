# Git guide
## Steps to save locally, and share with everyone else

## Track locally
Step 1:
Save your files (ctrl + s)

Step 2:
Open a terminal inside the project file path
(the one with the .git file)

Step 3:
type:
git status
to see the status of the project.
Changed files will be marked in red.

Step 4:
type:
git add .
this "adds" files for the next step: commit.

Step 5:
type:
git commit -m "Your commit message here, something short, but descriptive"
           /\
           (-m stands for "message")
## Continued - Share with everyone else

After commiting your changes, and you want to make your code availabe 
for everyone else, type:
git push
now your last commit will be uploaded to our repository!

OH NO!
it gave me an error, said something like:
"failed to push some refs...
updates were rejected because the reomote repository contains work that you do not"

This means that the project in the cloud is different from your local one, you need
to sync up!

What do I do?
type:
git pull
(then you may have to fiddle with VSCode to merge your code)

Then you may:
git push