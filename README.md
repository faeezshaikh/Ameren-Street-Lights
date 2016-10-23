# friendInNeed
## What it does

“Friend In Need” (FIN) is a complete mobile platform ( iOS, Android, Web) that connects people who need help with not only service providers but with millions of volunteers around the world who believe in doing more with less. 
FIN is a mobile HMIS that aims at improving the efficiency of the intake process, facilitate the flow of client information between CoC members, helps find open beds in emergency shelters based on client's demographic and eases the electronic referrals and Data sharing between the CoC Members.

The app helps the homeless as well as "at-risk" individuals prevent homelessness by providing instant access to local jobs from indeed.com based on their skill-sets.
The app integrates with the Open API by HUD.gov to connect clients and at-risk families with Government appointed HUD Agents.

A safe and secure integration with Stripe allows the app to let the general public help raise funds for families and individuals from anywhere in the world.

## How we built it

We used the supercool Ionic framework (AngularJS) and Firebase for the most part.
Integration with Indeed.com was through their Free REST API.
Found a pretty cool webservice from HUD.GOV that lets you find local HUD Agents with their contact info. [http://data.hud.gov/]
We used Stripe to write a small payment engine to **securely** accept online payments through credit card.
