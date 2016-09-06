const elixir = require('laravel-elixir');
require('laravel-elixir-livereload');

elixir(mix => {
    mix.sass('app.scss')
       .webpack('app.js')
       .livereload();
});
