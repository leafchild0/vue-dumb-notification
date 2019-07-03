# Dumb notifications with Vue.js
It's a super simple plugin to show notifications using Vue. It has no build and can be used in a browser. It's ES5 friendly. Inspired from [this](https://github.com/euvl/vue-notification) nitifcation library.

## How to use it
Just add JS and CSS into your html. Feel free to tweak styling. Plugin has a support for a certain properties:


All props are optional.

| Name             | Type    | Default      | Description |
| ---              | ---     | ---          | ---         |
| group            | String  | null         | Name of the notification holder, if specified |
| type             | String  | null         | Class that will be assigned to the notification |
| width            | Number/String  | 2000          | Width of notification holder, can be `%`, `px` string or number.<br>Valid values: '100%', '200px', 200 |
| classes          | String/Array | 'vue-notification' | List of classes that will be applied to notification element |
| position         | String/Array | 'top right'  | Part of the screen where notifications will pop out |
| speed            | Number  | 500          | Speed of animation showing/hiding |
| max              | Number  | 3     | Maximum number of notifications that can be shown in notification holder |
| reverse          | Boolean | false        | Show notifications in reverse order |
| ignoreDuplicates | Boolean | true        | Show notifications in reverse order |
| closeOnClick     | Boolean | true         | Close notification when clicked |


## Demo
There is an HTML file with files imported and small demo with different types of messages. It's pretty straightforward, but should be enough to understand.

## Contribute
Feel free to do anything with this plugin and change it how you need it. Do something good for others