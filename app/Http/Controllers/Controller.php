<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected $user;

    // ------------------------------------------------------------------------
    public function isApi()
    {
    	return true;
    }

    // ------------------------------------------------------------------------
    public function hasOrGet($item, $key)
    {   
        return request()->has($key) ? request()->get($key) : $item[$key];
    }

    // ------------------------------------------------------------------------
    protected function buildFailedValidationResponse(Request $request, array $errors)
    {

        if($this->isApi()) {
            return $this->apiValidationError($errors);
        }
        if (($request->ajax() && ! $request->pjax()) || $request->wantsJson()) {
            return new JsonResponse($errors, 422);
        }

        return redirect()->to($this->getRedirectUrl())
                        ->withInput($request->input())
                        ->withErrors($errors, $this->errorBag());
    }

    // ------------------------------------------------------------------------
	public function resourceCreated($resource)
	{	
        if($this->isApi()) {
            return response()->json([
                'status'=>202,
                'message'=>'resource created',
                'data'=>$resource
            ], 202);
        }
        return back()->with(['data'=>$resource]);
	}

    // ------------------------------------------------------------------------
    public function resourceUpdate($resource)
    {   
        if($this->isApi()) {
            return response()->json([
                'status'=>202,
                'message'=>'resource updated',
                'data'=>$resource
            ], 202);
        }

        return back()->with(['data'=>$resource]);
    }

    // ------------------------------------------------------------------------
    public function resourceDeleted($resource)
    {   

        if($this->isApi()) {
            return response()->json([
                'status'=>202,
                'message'=>'resource deleted',
                'data'=>$resource
            ], 202);
        }

        return redirect('/')->with(['data'=>$resource]);
    }

    // ------------------------------------------------------------------------
    public function resourceNotFound()
    {   
        if($this->isApi()) {
            return response()->json([
                'status'=>404,
                'error'=>'resource not found'
            ], 404);
        }
        return back()->with(['errors'=>'Resource not found']);
    }
    
    // ------------------------------------------------------------------------
	public function apiValidationError($errors)
	{	
        return response()->json([
        	'status'=>422,
        	'errors'=>$errors
        ], 422);
	}

    // ------------------------------------------------------------------------
    public function responseWithData($data)
    {   
        if($this->isApi()) {
            return response()->json([
                'status'=>200,
                'data'=>$data
            ], 200);
        }
        return redirect('/')->with(['data'=>$data]);
    }

    // ------------------------------------------------------------------------
    public function errorResponse($error)
    {   
        if($this->isApi()) {
            return $this->apiErrorResponse($error);
        }
        return back()->withErrors($error);
    }

    // ------------------------------------------------------------------------
    public function validationErrorResponse($validator)
    {   
        if($this->isApi()) {
            return $this->apiValidationError($validator->errors());
        }
        return back()->withErrors($validator);
    }

	// ------------------------------------------------------------------------
	public function apiResponse($data)
	{	
        return response()->json([
        	'status'=>200,
        	'data'=>$data
        ], 200);
	}

    // ------------------------------------------------------------------------
    public function apiErrorResponse($error, $code=404)
    {   
        return response()->json([
            'status'=>$code,
            'errors'=>$error
        ], $code);
    }
}
