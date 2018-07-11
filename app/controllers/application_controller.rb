class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :current_user

  def authenticate_admin
    unless admin_signed_in?
      unless user_signed_in?
        redirect_to :login
      else
        redirect_to :home
      end
    end
  end

  def authenticate
    unless user_signed_in?
      redirect_to :login
    end
  end

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def admin_signed_in?
    user_signed_in? && current_user.admin?
  end

  def user_signed_in?
    # converts current_user to a boolean by negating the negation
    !!current_user
  end
end
