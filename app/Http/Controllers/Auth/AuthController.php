<?php

namespace App\Http\Controllers\Auth;

use App\Http\Requests\ActivateAccountRequest;
use App\Http\Requests\FBSigninRequest;
use App\Http\Requests\SigninRequest;
use App\Http\Requests\SignupRequest;
use App\User;
use App\Http\Controllers\Controller;
use JWTAuth;

class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Registration & Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users, as well as the
    | authentication of existing users. By default, this controller uses
    | a simple trait to add these behaviors. Why don't you explore it?
    |
    */

    /**
     * Handles the login request.
     * @param SigninRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function signin(SigninRequest $request)
    {
        $response = [];
        try {
            $field = filter_var($request->get('user'), FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
            $request->merge([$field => $request->get('user')]);
            // Grab credentials from the request.
            $credentials = $request->only($field, 'password');
            $credentials['active'] = 1;

            $claims = ['company' => 'NST'];
            if ($request->has('remember')) {
                if ($request->get('remember') == true) {
                    $claims['exp'] = strtotime("+1 year");
                }
            }
            // Attempt to verify the credentials and create a token for the user.
            if ($token = JWTAuth::attempt($credentials, $claims)) {
                $response['code'] = 200;
                $response['token'] = $token;
                $response['data'] = JWTAuth::toUser($token);
            } else {
                $response['code'] = 422;
                $response['text'] = 'Invalid Credentials';
            }
        } catch (JWTException $e) {
            // Something went wrong whilst attempting to encode the token.
            $response['code'] = 500;
            $response['text'] = $e->getMessage();
        } catch (Exception $e) {
            // Server Error
            $response['code'] = 500;
            $response['text'] = $e->getMessage();
        }
        return response()->json($response);
    }

    /**
     * Handles the registration request.
     *
     * @param SignupRequest $request
     * @return User
     */
    public function signup(SignupRequest $request)
    {
        $response = [];

        try {
            // Process the requests provided.
            $email = $request->get('email');
            $data = [
                'first_name'      => $request->get('first_name'),
                'last_name'       => $request->get('last_name'),
                'email'           => $email,
                'password'        => Hash::make($request->get('password')),
                'gender'          => $request->get('gender'),
                'activation_code' => Hash::make($email . Carbon::now())
            ];
            // Create a new user.
            $user = User::create($data);
            // Set default values after creating an entry in the users table.
            $user->register();
            // Add to queue the user activation email.
            Mail::queue('emails.activate-user', $data, function ($message) use ($email) {
                $message->from(env('MAIL_ADDRESS', 'mail@example.com'), env('MAIL_NAME', 'Wizard Mailer'));
                $message->to($email);
                $message->subject(trans('app.account_activation'));
            });
            $response['code'] = 200;
            $response['data'] = $user;
        } catch (\Exception $e) {
            $response['code'] = 500;
            $response['text'] = $e->getMessage();
        }
        return response()->json($response);
    }

    /**
     * @param FBSigninRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function fbSignin(FBSigninRequest $request)
    {
        $response = [];
        try {
            // Process the requests provided.
            $email = $request->get('email');
            $fb_id = (int)$request->get('id');
            if (User::whereFbId($fb_id)->count() == 0) {
                $data = [
                    'first_name' => $request->get('first_name'),
                    'last_name'  => $request->get('last_name'),
                    'email'      => $email,
                    'password'   => Hash::make($fb_id),
                    'gender'     => $request->get('gender'),
                    'fb_id'      => $fb_id,
                    'active'     => 1
                ];
                // Create a new user.
                $user = User::create($data);
                //get and set profile picture
                if ($profile = @file_get_contents($request->get('url'))) {
                    $dir = public_path() . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'profile';
                    if (!is_dir($dir)) {
                        @mkdir($dir, 0777, true);
                    }
                    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    $crypt = '';
                    for ($i = 0; $i < 10; $i++) {
                        $crypt .= $characters[rand(0, strlen($characters) - 1)];
                    }
                    $avatar = $dir . DIRECTORY_SEPARATOR . md5($fb_id . $crypt) . '-avatar.jpg';
                    if (@file_put_contents($avatar, $profile)) {
                        $user->avatar = $avatar;
                    }
                }
                $user->activated_at = Carbon::now();
                // Set default values after creating an entry in the users table.
                $user->register();
            }
            $credentials = [
                'fb_id'    => $fb_id,
                'password' => $fb_id,
                'active'   => 1
            ];
            if ($token = JWTAuth::attempt($credentials)) {
                $response['code'] = 200;
                $response['token'] = $token;
                $response['data'] = JWTAuth::toUser($token);
            } else {
                $response['code'] = 422;
                $response['text'] = 'Invalid Credentials';
            }
        } catch (\Exception $e) {
            $response['code'] = 500;
            $response['text'] = $e->getMessage();
        }

        return response()->json($response);
    }

    /**
     * Activate the user, the link comes from the email sent upon registration.
     * @param ActivateAccountRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function activate(ActivateAccountRequest $request)
    {
        $response = [];
        try {
            if (
            User::where('email', $request->get('email'))
                ->where('activation_code', $request->get('code'))
                ->where('active', 0)
                ->update([
                    'active'          => 1,
                    'activation_code' => '',
                    'activated_at'    => Carbon::now()
                ])
            ) {
                $response['code'] = 200;
                $response['text'] = 'Activated';
            } else {
                $response['code'] = 417;
                $response['text'] = 'Activation Failed';
            }
        } catch (\PDOException $e) {
            $response['code'] = 500;
            $response['text'] = $e->getMessage();
        } catch (\Exception $e) {
            $response['code'] = 500;
            $response['text'] = $e->getMessage();
        }
        return response()->json($response);
    }

    /**
     * Deactivate active user.
     * @return \Illuminate\Http\JsonResponse
     */
    public function signout()
    {
        $response = [];
        try {
            if (JWTAuth::setToken($this->logged->token)->invalidate()) {
                $response['text'] = 'Signed out';
                $response['code'] = 200;
            } else {
                $response['text'] = 'Cannot sign out';
                $response['code'] = 417;
            }
        } catch (JWTException $e) {
            $response['text'] = $e->getMessage();
            $response['code'] = $e->getCode();
        } catch (\Exception $e) {
            $response['text'] = $e->getMessage();
            $response['code'] = $e->getCode();
        }
        return response()->json($response);
    }

}
