class HomeController < ApplicationController
  def show
    if admin_signed_in?
      redirect_to experiments_path
    elsif user_signed_in?
      render :show_logged_in
    else
      render :show
    end
  end
end
