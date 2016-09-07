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

	<div class="titlearea">
		<span class="hidden">the brown phone</span>
	</div>

	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<form class="form-horizontal" method="POST">


				<fieldset>
				{{ csrf_field() }}

				<!-- Text input-->
				<div class="form-group">
				  <label class="col-md-4 control-label" for="name">Name</label>  
				  <div class="col-md-4">
				  <input id="name" name="name" type="text" value="{{Auth::user()->name}}" placeholder="Name" class="form-control input-md">
				  </div>
				</div>

				<!-- Text input-->
				<div class="form-group">
				  <label class="col-md-4 control-label" for="email">Email</label>  
				  <div class="col-md-4">
				  <input id="email" name="email" value="{{Auth::user()->email}}" type="text" placeholder="Email" class="form-control input-md">
				  </div>
				</div>

			<div class="col-md-12 text-center"
						<p>Record a piece of advice or something inspiring for Matt Brown to hear.</p>
					</div>

				<!-- record Button --> 
				<div class="form-group">
					<label class="col-md-4 control-label" for="singlebutton">Recording</label>
			  		<div class="col-md-4">
			    		<button id="recording" name="recording" class="btn btn-defualt">Start Recording</button>
			  		</div>
				</div>

				<!-- upload a recording --> 
				<div class="form-group">
					<label class="col-md-4 control-label" for="singlebutton">Upload Recording</label>
			  		<div class="col-md-4">
					<input type="file" id="file-upload" name="audio_upload" accept="audio/*"></input>
			  		</div>
				</div>


				<!-- recording --> 
				<div class="form-group">
					<label class="col-md-4 control-label" for="singlebutton"></label>
			  		<div class="col-md-4" id="recording-col">
			  		</div>
				</div>



				<!-- Button -->
				<div class="form-group">
					<label class="col-md-4 control-label" for="singlebutton"></label>
			  		<div class="col-md-4">
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
						<div class="pull-right">
							<audio src="{{$recording->audio_file}}" controls></audio>
						</div>	
						
						{{$recording->created_at->diffForHumans()}}<br>
						<a data-id="{{$recording->id}}" class="link delete-recording" src="">Delete</a>

					</li>
				@endforeach
			</ul>
		</div>
	</div>	


	<a class="logout" href="/logout">Logout</a>

</div>

</body>
@if ( Config::get('app.debug') )
  <script type="text/javascript">
    document.write('<script src="//localhost:35729/livereload.js?snipver=1" type="text/javascript"><\/script>')
  </script> 
@endif
</html>