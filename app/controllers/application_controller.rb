class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :current_user

  def authenticate
    unless user_signed_in? && current_user.admin?
      redirect_to :login
    end
  end

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def user_signed_in?
    # converts current_user to a boolean by negating the negation
    !!current_user
  end
end
