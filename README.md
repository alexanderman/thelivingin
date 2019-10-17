## firebase cli
[Deploy to multiple environments with Firebase Hosting](https://firebase.googleblog.com/2016/07/deploy-to-multiple-environments-with.html)  
 - `firebase use --add` will list projects to select from and prompt for `alias`, this will add project with alias to `.firebase` file
 - `firebase use {alias}` will switch to aliased project
    - `firebase deploy` will deploy to currently selected environment
    - `firebase deploy -P {alias}` will deploy to `alias` environment, without switching

## run locally
 - `cd functions`
 - `npm start`

remote changed