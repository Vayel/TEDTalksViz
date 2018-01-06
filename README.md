# TEDTalksViz

Interative visualizations of the dataset https://www.kaggle.com/rounakbanik/ted-talks

## Dataset overview


## Questions

### How does the number of talks per subject change over time?

* What is the total number of talks per month?
* What is the repartition of subjects (education, war...)?

Two charts:

* A bar plot representing the number of talks per theme for a given month, with
the possibility to animate it over time (to see the evolution). The user can also
select multiple themes by clicking on the bars to see their evolution over time on
a line plot.
* A line plot representing the selected subjects. X is the month and f(X) the
number of talks. By clicking on a point, the user can select the month represented
on the bar plot.

### What are the favorite themes over time?

A plot similar to https://youtu.be/jbkSRLYSojo?t=1m40s.

* Color = theme
* X = number of views
* Y = ?
* Size = number of talks

### How does the speaker occupation influence the ratings?

For each criterion, take the ratio and not the absolute number of votes as the second
depends on the number of views.

Plot something similar to http://annalyn-ng.com/starwarsb5/chart.html, with character
name being the occupation. As we will have multiple talks for one occupation, take
the mean of the ratios.

### How does the duration influence the number of comments?
