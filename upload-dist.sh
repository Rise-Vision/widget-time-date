cp -r dist time-date
gsutil rsync -d -r time-date gs://install-versions.risevision.com/widgets/time-date
gsutil -m acl -r ch -u AllUsers:R gs://install-versions.risevision.com/widgets/time-date
gsutil -m setmeta -r -h Cache-Control:private,max-age=0 gs://install-versions.risevision.com/widgets/time-date
