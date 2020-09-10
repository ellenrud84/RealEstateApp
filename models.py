# def create_classes(db):
#     class ZipCode(db.Model):
#         __tablename = 'zip_code'

#         zip_code= db.Column(db.Integer, primary_key=True)

#         def __repr__(self):
#             return<'Zip %r>' % <self.zip_code>
#     return ZipCode

#     class FloodZone(db.Model):
#         __tablename = 'flood_zone'

#         Flood_Zone= db.Column(db.string(300), primary_key=True)
#         Flood_Description= db.Column(db.string(2))

#         def __repr__(self):
#             return<'Zip %r>' % <self.zip_code>
#     return ZipCode