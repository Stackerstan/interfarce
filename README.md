# Grand Majestic Interfarce
A frontend to the [Mindmachine](https://github.com/Stackerstan/mindmachine).   
stackerstan.org is served by this repository using github pages.

### Build and run
By default, the Interfarce connects to a public facing Mindmachine. You can simply clone this repo and open index.html in a browser. Errors are reported in the JS console.

However, you **should** build and run the Mindmachine first and then use this interface to connect to your local instance of it.

Simply edit index.html and replace `wss://mindmachine.688.org` with `ws://127.0.0.1:1031` to connect to your local Mindmachine.

##### WSL 2 on Windows
If you are running the mindmachine on Windows using WSL2:

0. Change config.yaml. Set websocketaddr to `0.0.0.0:1031` (originally `127.0.0.1:1031`)
1. Run`ip a |grep "global eth0“` and you will get `inet xxx.xxx.xxx.xxx/20 brd aaa.aaa.aaa.aaa scope global eth0`
2. Edit index.html, replace `wss://mindmachine.688.org` with `ws://xxx.xxx.xxx.xxx:1031`
3. Open index.html
### Contributing
1. Have a Stackerstan account and be in the Identity Tree if you want to claim an expense for your Patch.
2. Fork this github repository under your own github account.
3. Clone _your_ fork locally on your development machine.
4. Choose _one_ problem to solve (it SHOULD exist on the Stackerstan problem tracker in addition to Github). If you aren't solving a problem that's already in the issue tracker you should describe the problem (and your idea of the solution) first to see if anyone else has something to say about it (maybe someone is already working on a solution, or maybe you're doing something wrong).

**It is important to claim the issue you want to work on so that others don't work on the same thing. Comment on the Github issue to let others know you are going to work on it**

4. Add this repository as an upstream source and pull any changes:
```
git remote add upstream git@github.com:Stackerstan/interfarce.git //only needs to be done once
git checkout master //just to make sure you're on the correct branch
git pull upstream master //this grabs any code that has changed, you want to be working on the latest 'version'
git push //update your remote fork with the changes you just pulled from upstream master
```
5. Create a local branch on your machine `git checkout -b branch_name` (it's usually a good idea to call the branch something that describes the problem you are solving). _Never_ develop on the `master` branch, as the `master` branch is exclusively used to accept incoming changes from `upstream:master` and you'll run into problems if you try to use it for anything else.
6. Solve the problem in the absolute most simple and fastest possible way with the smallest number of changes humanly possible. Tell other people what you're doing by putting _very clear and descriptive comments in your code_. When you think's it's solved, make sure you didn't break anything:
  
7. Commit your changes to your own fork:
Before you commit changes, you should check if you are working on the latest version (again). Go to the github website and open _your_ fork of the repo, it should say _This branch is even with interfarce:master._    
If **not**, you need to pull the latest changes from the upstream interfarce repository and replay your changes on top of the latest version:
```
@: git stash //save your work locally
@: git checkout master
@: git pull upstream master
@: git push
@: git checkout -b branch_name_stash
@: git stash pop //_replay_ your work on the new branch which is now fully up to date with this repository
```

Note: after running `git stash pop` you should run look over your code again and open index.html to check that everything still works as sometimes a file you worked on was changed in the meantime.

Now you can add your changes:   
```
@: git add changed_file.js //repeat for each file you changed
```

And then commit your changes:
```
@: git commit -m 'problem: <70 characters describing the problem //do not close the '', press ENTER two (2) times
>
>solution: short description of how you solved the problem.' //Now you can close the ''.    
@: git push //this will send your changes to _your_ fork on Github
```    
8. Go to your fork on Github and select the branch you just worked on. Click "pull request" to send a pull request back to the mindmachine repository.
9. Send the pull request, be sure to mention the UID of the Problem from Stackerstan and also the Github issue number with a # symbol at the front.  
10. Go back to the issue, and make a comment:
  ```
    Done in #(PR_NUMBER)
  ```
  
  The problem's Curator can then test your solution and close the issue if it solves the problem.

#### What happens after I send a pull request?    
If your pull request contains a correct patch (basically if you followed this guide) a maintainer will merge it.
If you want to work on another problem while you are waiting for it to merge simply repeat the above steps starting at Step 4:
```
@: git checkout master
```
After your pull request is merged, a Maintainer should grab the diff by going to the commit URL on github and appending `.diff`, and then copy this over to the Patch Chain at the appropriate height.

