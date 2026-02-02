CLAUDE_SKILLS_DIR := $(HOME)/.claude/skills
CODEX_SKILLS_DIR := $(HOME)/.codex/skills
SKILL_DIRS := $(shell find . -maxdepth 2 -name 'SKILL.md' -exec dirname {} \;)

.PHONY: link unlink

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
