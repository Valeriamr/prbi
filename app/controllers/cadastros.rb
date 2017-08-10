Prbi::App.controllers :cadastros do

  get :login, :map => '/login' do
      render 'entrar/login'
  end

  post :create do
    if account = Account.authenticate(params[:email], params[:password])
      # set_current_account(account)
      render 'datas/selecionar'
    else
      params[:email], params[:password] = h(params[:email]), h(params[:password])
      flash[:error] = "Problema ao efetuar login."
      params[:previousurl] = h(params[:previousurl])
      redirect url(back + '#login')
    end
  end

end