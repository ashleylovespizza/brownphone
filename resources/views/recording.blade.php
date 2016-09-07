<!DOCTYPE HTML>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="csrf_token" content="{{ csrf_token() }}">
	<title>The Brown Phone</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css">
<link href="https://fonts.googleapis.com/css?family=Catamaran:800,900|Lora" rel="stylesheet">
	<link rel="stylesheet" href="css/app.css">
	<link rel="icon" type="image/png" href="favicon.png">
    	<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    	<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    	<!--[if lt IE 9]>
      	<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      	<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    	<![endif]-->
	<script src="https://code.jquery.com/jquery.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.14.1/moment.min.js"></script>
	<script src="/js/vendor/recorder.js"></script>
	<script src="/js/app.js"></script>
	<style type="text/css">
		
	</style>
</head>
<body>
<div class="main test">
		
	<div class="main-nav" role="navigation">
		<div class="container-fluid"> 
		    <ul class="user-menu">
		        <li class="list-unstyled">
		            <a href="#" class="dropdown-toggle user-image" data-toggle="dropdown">
		                <img width="30px" src="{{Auth::user()->avatar}}" class="img-circle"></img> 
		            </a>
		            <ul class="list-unstyled user-dropdown-menu">
		                <li>{{Auth::user()->name}}</li>
		                <li>{{Auth::user()->email}}</li>
		                <li class="divider"></li>
		                <li><a href="/logout" class="btn btn-danger btn-block">Sign Out</a></li>
		            </ul>
		        </li>
		    </ul>
		</div>
	</div>

	<div class="titlearea">
		<span class="hidden">the brown phone</span>
	</div>

	{{--<div class="signed-in">
		<img src="{{Auth::user()->avatar}}" class="img-circle"></img>
		<h3>{{Auth::user()->name}}</h3>
		<h5>{{Auth::user()->email}}</h5>
		</div>--}}

	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<form class="form-horizontal" method="POST">

				<fieldset>
				{{ csrf_field() }}
				<input id="name" name="name" type="hidden" value="{{Auth::user()->name}}" placeholder="Name" class="form-control input-md">
				<input id="email" name="email" type="hidden" value="{{Auth::user()->email}}" placeholder="Email" class="form-control input-md">
				
				<p class="text-center">Record a piece of advice or something inspiring for Matt Brown to hear.</p>

				<!-- record Button --> 
		  		<div class="row">
		  			<div class="col-sm-4 col-sm-offset-2 col-md-3 col-md-offset-3 col-lg-3 col-lg-offset-3 text-center">
		    			<button id="recording" name="recording" class="btn btn-defualt">Start Recording</button>
			  			<!-- recording --> 
		  				<div id="recording-col"></div>
			  		</div>
			  		<div class="col-sm-4 col-md-3 col-lg-3 text-center">
						<div class="btn btn-default btn-file" id="upload-file">Upload Audio <input type="file" id="file-upload" name="audio_upload" accept="audio/*"></input></div>
			  		</div>
		  		</div>


				<!-- Button -->
				<div class="row">
			  		<div class="col-sm-12 text-center">
			    		<button id="submit" name="submit" class="btn btn-primary">Submit</button>
			  		</div>
				</div>

				</fieldset>
			</form>
		</div>
	</div>
					
	<div class="row">
		<div class="col-md-12">
			<h3>Your Brown Phone Advice:</h3>
			<ul class="list-group">
				@foreach (Auth::user()->recordings as $recording)
					<li class="list-group-item recording-{{$recording->id}}">
						<div class="past-recording">
							<audio src="{{$recording->audio_file}}" controls></audio>
						</div>	
						
						{{$recording->created_at->diffForHumans()}}<br>
						<a data-id="{{$recording->id}}" class="link delete-recording" src="">Delete</a>

					</li>
				@endforeach
			</ul>
		</div>
	</div>	

</div>

</body>
@if ( Config::get('app.debug') )
  <script type="text/javascript">
    document.write('<script src="//localhost:35729/livereload.js?snipver=1" type="text/javascript"><\/script>')
  </script> 
@endif
</html>