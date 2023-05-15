set -e

tar_file=dejavu-fonts-ttf-2.37.tar.bz2
if [[ ! -f "$tar_file" ]]; then
  wget https://github.com/dejavu-fonts/dejavu-fonts/releases/download/version_2_37/$tar_file
  tar xjvf $tar_file
fi

npx playwright test --browser all test/
