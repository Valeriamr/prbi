class Tema
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug # adds created_at and updated_at fields
  # include Mongoid::Paranoia

  # field <name>, :type => <type>, :default => <value>
  

  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>

  field :titulo, :type => String
  field :url_tema, :type => String
  field :img_url, :type => String
  field :introducao, :type => String
  field :regras, :type => String
  field :image, :type => String
  field :author, :type => String
  field :folha_de_resposta, :type => String
  field :vestibular, :type => Integer
  field :podcast, :type => String

  validates_presence_of :url_tema

  #Meta Tags
  field :meta_description, :type => String
  field :meta_tags, :type => String

  slug :titulo
  
  has_many :textos


  # has_one :att
  # accepts_nested_attributes_for :att, :allow_destroy => true
end
