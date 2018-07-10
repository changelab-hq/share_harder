class SessionsController < ApplicationController
  
  def create
    @user = User.find_or_create_from_auth_hash(request.env["omniauth.auth"])
    session[:user_id] = @user.id
    cookies.signed["user_id"] = { value: @user.id }
    redirect_to :me
  end

  def destroy
    session[:user_id] = nil
    cookies.signed["user_id"] = nil
    redirect_to root_path
  end

end