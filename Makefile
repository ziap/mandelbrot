CFLAGS=-Wall -Wextra -march=native -mtune=native
LDLIBS=-lm -lglfw -lGL -lGLEW -lX11 -lGLU
DEBUG_FLAGS=-Og -g
BUILD_FLAGS=-O3 -s

INPUT_DIR=src
INPUTS=$(wildcard $(INPUT_DIR)/*.c)
OUTPUT=mandelbrot

SHADER_DIR=shaders
FRAGMENT_SHADERS=$(wildcard $(SHADER_DIR)/*.frag)
SHADER_OUTPUTS=$(patsubst %.frag, $(SHADER_DIR)/%.h, $(notdir $(FRAGMENT_SHADERS)))

.PHONY: build debug

build: build/$(OUTPUT)

debug: debug/$(OUTPUT)

build/$(OUTPUT): $(INPUTS) $(SHADER_OUTPUTS)
	@mkdir -p build
	$(CC) -o $@ $(INPUTS) $(CFLAGS) $(BUILD_FLAGS) $(LDLIBS)

debug/$(OUTPUT): $(INPUTS) $(SHADER_OUTPUTS)
	@mkdir -p debug
	$(CC) -o $@ $(INPUTS) $(CFLAGS) $(DEBUG_FLAGS) $(LDLIBS)

$(SHADER_OUTPUTS): $(SHADER_DIR)/%.h: $(SHADER_DIR)/%.frag $(SHADER_DIR)/%.vert
	@echo Generating $@
	@echo "static const char* $(basename $(notdir $@))_frag = " > $@
	@sed 's/^/\"/g' $(word 1,$^) | sed 's/$$/\\n\"/g' >> $@
	@echo ";" >> $@
	@echo "static const char* $(basename $(notdir $@))_vert = " >> $@
	@sed 's/^/\"/g' $(word 2,$^) | sed 's/$$/\\n\"/g' >> $@
	@echo ";" >> $@
