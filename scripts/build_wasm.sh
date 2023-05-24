em++ \
  -O2 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORTED_FUNCTIONS=_ttf_to_woff2,_woff2_to_ttf,_malloc,_free \
  -s EXPORTED_RUNTIME_METHODS='["ccall"]' \
  -I build/sysroot/usr/local/include \
  -o public/woff2.js \
  wasm/api.cpp \
  -L build/sysroot/usr/local/lib \
  -l brotlienc \
  -l brotlidec \
  -l brotlicommon \
  -l woff2enc \
  -l woff2dec \
  -l woff2common
