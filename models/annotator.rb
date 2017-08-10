class Annotator
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Attributes::Dynamic
  # include Mongoid::Userstamp
  # field <name>, :type => <type>, :default => <value>

  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>
  field :id, type: String
  field :annotator_schema_version 
  field :created
  field :updated
  field :text
  field :quote
  field :uri
  field :ranges, type: Array
  field :user
  field :consumer
  field :tags, type: Array
  field :permissions, type: Hash
  # field :homologador_id, type: String

  belongs_to :texto
  
  # track_history   :on => [:fields],
  #                 :modifier_field => :texto, # adds "belongs_to :modifier" to track who made the change, default is :modifier
  #                 :version_field => :version,   # adds "field :version, :type => Integer" to track current version, default is :version
  #                 :track_create   =>  false,    # track document creation, default is false
  #                 :track_update   =>  true,     # track document updates, default is true
  #                 :track_destroy  =>  true     # track document destruction, default is false
end
