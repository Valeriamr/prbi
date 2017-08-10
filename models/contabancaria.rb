class Contabancaria
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields

  field :banco, type: String
  field :agencia, type: String
  field :conta, type: String
  field :tipo, type: String
  field :cpf, type: String
  field :titular, type: String
  field :agencia_dv, type: String
  field :conta_dv, type: String
  field :bank_code, type: String

  # id no pagarme BankAccount
  field :id_pagarme


  before_save do |doc|
    unless doc.changed.include?('_id')
      bank                         = {}
      bank['bank_code']            = doc.bank_code
      bank['agencia']              = doc.agencia
      bank['agencia_dv']           = doc.agencia_dv
      bank['agencia_dv']           = nil if bank['agencia_dv'] == ''
      bank['conta']                = doc.conta
      bank['conta_dv']             = doc.conta_dv
      bank['conta_dv']             = nil if bank['conta_dv'] == ''
      bank['legal_name']           = (doc.titular << '                     ')[0, 30].strip
      bank['document_number']      = doc.cpf
      bank['charge_transfer_fees'] = false

      doc.titular.strip!

      bank_account = PagarMe::BankAccount.new(bank)
      bank_account.create

      doc.id_pagarme = bank_account.id
      # conta.save

      if doc.aluno.id_pagarme.to_s == ''
        # ap 'sem Recebedor'
        recipiente = PagarMe::Recipient.create(
            transfer_interval: 'monthly',
            transfer_day:      3,
            transfer_enabled:  true,
            bank_account_id:   doc.id_pagarme
        )

        doc.aluno.id_pagarme = recipiente.id
        doc.aluno.save
      else
        # ap 'com Recebedor'
        recipiente                 = PagarMe::Recipient.find_by_id(doc.aluno.id_pagarme)
        recipiente.bank_account_id = doc.id_pagarme
        recipiente.save
      end
    end
  end

  # -- AP
  # after_save do |doc|
  #   ap doc
  #   ap PagarMe::Recipient.find_by_id(doc.aluno.id_pagarme)
  # end


  belongs_to :aluno
end