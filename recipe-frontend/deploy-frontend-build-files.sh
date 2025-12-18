# Does not guarantee all files in dist are copied to S#
# Assumptions about build files:
# 	only one subdirectory, _astro containing only non-html files 
# 	pages are .html files in dist/
# 	no nested pages

s3uri="s3://stovetop-recipe-app"
# REPLACE DIST path to match locally
dist="$HOME/Projects/Recipe-App/recipe-frontend/dist"

# Delete all astro files (keep images) from S3 bucket
aws s3 rm $s3uri --recursive --exclude "content" --exclude "content/*"

# Adds asset and page files
# Adds .html page files with the extension removed for compatibility with local development
for f in ${dist}/*; do
	[[ -d $f ]] && continue
	name=$(realpath --relative-to=$dist $f)
	case $name in 
		*.html) 
			aws s3 mv $f "${s3uri}/${name%.html}" --content-type 'text/html'
		;;
		*)
			aws s3 cp $f $s3uri
		;;
	esac
done

# Adds script files in _astro directory
aws s3 cp "${dist}/_astro" "${s3uri}/_astro" --recursive
