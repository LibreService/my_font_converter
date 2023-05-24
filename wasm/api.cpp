#include <cstdint>
#include <woff2/encode.h>
#include <woff2/decode.h>
#include <emscripten.h>

uint32_t total;

extern "C" {
    void _progress (uint32_t n) {
        EM_ASM(_progress($0), (int)((double)n / total * 100));
    }

    size_t ttf_to_woff2 (uint8_t *ttf, size_t n) {
        total = n;
        size_t output_size = woff2::MaxWOFF2CompressedSize(ttf, n);
        uint8_t *woff2 = new uint8_t[output_size];
        if (!woff2::ConvertTTFToWOFF2(ttf, n, woff2, &output_size)) {
            delete[] woff2;
            return 0;
        }
        EM_ASM(_ptr = $0, woff2);
        return output_size;
    }

    size_t woff2_to_ttf (uint8_t *woff2, size_t n) {
        total = n;
        size_t output_size = std::min(
            woff2::ComputeWOFF2FinalSize(woff2, n),
            woff2::kDefaultMaxSize
        );
        uint8_t *ttf = new uint8_t[output_size];
        woff2::WOFF2MemoryOut out(ttf, output_size);
        if (!woff2::ConvertWOFF2ToTTF(woff2, n, &out)) {
            delete[] ttf;
            return 0;
        }
        EM_ASM(_ptr = $0, ttf);
        return output_size;
    }
}
