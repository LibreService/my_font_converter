#include <cstdint>
#include <woff2/encode.h>
#include <emscripten.h>

extern "C" {
    void _progress (int percentage) {
        EM_ASM(_progress($0), percentage);
    }

    size_t ttf_to_woff2 (uint8_t *ttf, size_t n) {
        size_t output_size = woff2::MaxWOFF2CompressedSize(ttf, n);
        uint8_t *woff2 = new uint8_t[output_size];
        if (!woff2::ConvertTTFToWOFF2(ttf, n, woff2, &n)) {
            delete[] woff2;
            return 0;
        }
        EM_ASM(_ptr = $0, woff2);
        return n;
    }
}
