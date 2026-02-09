CLAUDE_SKILLS_DIR := $(HOME)/.claude/skills
CODEX_SKILLS_DIR := $(HOME)/.codex/skills
SKILL_DIRS := $(shell find . -maxdepth 2 -name 'SKILL.md' -exec dirname {} \;)
DIST := dist/clawdhub

.PHONY: link unlink build clean

link:
	@mkdir -p $(CLAUDE_SKILLS_DIR) $(CODEX_SKILLS_DIR)
	@for skill in $(SKILL_DIRS); do \
		name=$$(basename $$skill); \
		for dir in $(CLAUDE_SKILLS_DIR) $(CODEX_SKILLS_DIR); do \
			target=$$dir/$$name; \
			if [ -L "$$target" ]; then \
				rm "$$target"; \
			fi; \
			ln -s "$$(pwd)/$$name" "$$target"; \
			echo "Linked: $$name -> $$target"; \
		done; \
	done

unlink:
	@for skill in $(SKILL_DIRS); do \
		name=$$(basename $$skill); \
		for dir in $(CLAUDE_SKILLS_DIR) $(CODEX_SKILLS_DIR); do \
			target=$$dir/$$name; \
			if [ -L "$$target" ]; then \
				rm "$$target"; \
				echo "Unlinked: $$target"; \
			fi; \
		done; \
	done

build:
	@rm -rf $(DIST)
	@for skill in $(SKILL_DIRS); do \
		name=$$(basename $$skill); \
		out=$(DIST)/$$name; \
		mkdir -p $$out; \
		cp $$skill/SKILL.md $$out/; \
		for sub in references scripts agents assets; do \
			if [ -d "$$skill/$$sub" ]; then \
				cp -r $$skill/$$sub $$out/; \
			fi; \
		done; \
		echo "Built: $$out"; \
	done

clean:
	rm -rf dist
