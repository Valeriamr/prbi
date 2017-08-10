class Course
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields
  include Mongoid::Slug

  # field <name>, :type => <type>, :default => <value>

  field :active, :type => Boolean, :default => true #Aparece na lista de cursos?
  field :available, :type => Boolean, :default => false #Disponível para venda?
  field :title, :type => String
  field :description, :type => String
  field :long_description, :type => String
  field :pricing, :type => Float
  field :price_description, :type => String
  field :author, :type => String
  field :teacher, :type => String
  field :author_bio, :type => String
  field :author_picture, :type => String
  field :image, :type => String
  field :video_embed, :type => String
  field :list_id, :type => String #Código da lista para o sendy
  field :more_info, :type => String #HTML de mais informações
  field :testimonials, :type => String #HTML de depoimentos
  field :plan, :type => String



  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  slug :title

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>

  has_many :sections
end
