class Att
  include Mongoid::Document
  include Mongoid::Paperclip

  # AWS.config(access_key_id: 'AKIAJ3YV3UL23VYQLWAA', secret_access_key: '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', region: 'us-west-1')

  belongs_to :tema
  belongs_to :texto

  field :tmp
  has_mongoid_attached_file :attachment, {
    :url => ':s3_domain_url',
    :path => 'assets/:basename.:extension',
    :s3_protocol => :https,
    :storage        => :s3,
    :bucket    => 'projetoredacao',
    :styles => {
      :original => ['1920x1680>', :jpg],
      :small    => ['100x100#',   :jpg],
      :medium   => ['250x250',    :jpg],
      :large    => ['600x600>',   :jpg]
    },
    # :convert_options => { :all => '-background white -flatten +matte' }
  }

  validates_attachment_content_type :attachment, :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"]
end