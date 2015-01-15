Exploring Variation in MEPs’ Adoption and Use of Twitter as a Representational Tool
===================
This is the research conducted by John Scherpereel, Peg Schmelzinger, and Jerry Wohlgemuth for the paper *Exploring Variation in MEPs’ Adoption and Use of Twitter as a Representational Tool*. To reproduce our research you can compile the included Rnw document. To get started with RStudio and knitr, you can follow the tutorial below. Instructions are only available for OSX as of now. If you are not a collaborator, you will not be able to push your changes directly to the master branch. Instead, create your own fork to test it out.

####Getting started with RStudio and knitr on OSX
This is a quick set of instructions to get up and running with RStudio, knitr and git on OSX. By the end of this tutorial, you should be ready to knit your R code into great looking LaTeX documents. We'll be using this Github project as an example.

First, download MacTeX [here](http://mirror.ctan.org/systems/mac/mactex/MacTeX.pkg). This is a HUGE file, so while it downloads, start the next steps.

Next, get R from [here](http://cran.r-project.org/bin/macosx/R-3.1.2-snowleopard.pkg).

Then, get RStudio [here](http://download1.rstudio.org/RStudio-0.98.1091.dmg).

Open a terminal by going to Applications>Utilities>Terminal. You can now enter a R shell by typing `R`. Once in the shell, run `install.packages("ggplot2", "knitr", "xtable")`. We'll be using ggplot and knitr to compile our test document later and xtable is used to output some sample regression tables.

Open up RStudio. Now, we'll need to configure the IDE to use knitr rather than Sweave. Go to Tools>Global Options. Select Sweave from the right, and select knitr from the first drop down at the top that states "Weave Rnw files using:" Close RStudio when your finished.

We need to get Xcode installed if you don't already have it. Go [here](https://itunes.apple.com/us/app/xcode/id497799835?ls=1&mt=12) and click on "View in Mac App Store" which will redirect you to the store where you'll click "Get."

You should now see Xcode as an application. Open it and let it install.

Next, get git from [here](http://git-scm.com/download/mac).

Head over to http://github.com and create an account.

Now in RStudio, go to File>New Project>Version Control>Git.

In "Repository URL" enter: https://github.com/wohlgejm/eu-twitter-analysis.git. You can set the sub-directory to where ever you want the project to save, such as your Documents or Desktop.

You should now have the project loaded into RStudio successfully.

Go ahead and make an update to the "test.Rnw" document . Click "Git" in the upper right hand panel. Here you'll see a list of files. You should see that "test.Rnw" now has a status of "Modified" indicated by a blue M. If you don't, click the save button in the top panel.

Now that you've made this change, you'll want to commit it. First, check the box next to the file. Next, click "Commit" on the upper right hand panel. A window will launch showing you the changes you've made. Make sure to enter a "Commit Message" which should be an explanation of the change you made. After you've done that, click "Commit."

Your changes have been saved locally, but haven't been saved in the Github repository. Right now, there is a bug with RStudio that has to do with HTTPS, so you cannot use the "Push" button in the top right panel. We'll have to push our commits from the terminal. To do this, open a terminal, cd to the eu-twitter-analysis directory and run: `git push`. You will be prompted for your Github username and password. Once this is complete, your changes will be saved to the repository. If someone else has contributed during this time, you'll be prompted to merge the code. 

To get the changes others have made to the repository, simply press "Pull" in the upper right hand panel to update the code base. 