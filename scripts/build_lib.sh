set -e

root=$PWD
n=`python -c 'import multiprocessing as mp; print(mp.cpu_count())'`

pushd woff2/brotli
if [[ -z `git status --porcelain` ]]; then
  git apply $root/brotli_patch
fi
popd

pushd woff2
if [[ -z `git status --porcelain --ignore-submodules` ]]; then
  git apply $root/woff2_patch
fi
popd

emcmake cmake woff2/brotli -B build/brotli \
  -DBROTLI_DISABLE_TESTS:BOOL=ON \
  -DCMAKE_INSTALL_PREFIX:PATH=/usr/local
make DESTDIR=$root/build/sysroot -C build/brotli install -j $n

emcmake cmake woff2 -B build/woff2 \
  -DCMAKE_FIND_ROOT_PATH:PATH=$root/build/sysroot/usr/local \
  -DBUILD_SHARED_LIBS=OFF \
  -DCMAKE_INSTALL_PREFIX:PATH=/usr/local
make DESTDIR=$root/build/sysroot -C build/woff2 install -j $n
