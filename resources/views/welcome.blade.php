<!DOCTYPE HTML>
<html>
 <head>
    <title>Full Screen</title>

    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="Full Screen">

    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui">

    <link rel="stylesheet" type="text/css" href="http://cdn.app-framework-software.intel.com/2.1/af.ui.css" />
    <link rel="stylesheet" type="text/css" href="http://cdn.app-framework-software.intel.com/2.1/icons.css" />
    <script type="text/javascript" charset="utf-8" src="http://cdn.app-framework-software.intel.com/2.1/appframework.ui.min.js"></script>
    
</head>

<body>
<div id="afui" class="ios">
    <div id="content" style="">
        <div class="panel" title="Hello" id="home" selected="true">
            <br>
            <p>This is main page</p>
            <a class="button block" href="#next">Next Page</a>
        </div>
        
        <div class="panel" title="World" id="next">
            <br>
            <p>This is second page</p>
        </div>        
    </div>
</div>
</body>
</html>