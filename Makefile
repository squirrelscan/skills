SKILLS_DIR := $(HOME)/.claude/skills
SKILL_DIRS := $(shell find . -maxdepth 2 -name 'SKILL.md' -exec dirname {} \;)

.PHONY: link unlink

link:
	@mkdir -p $(SKILLS_DIR)
	@for skill in $(SKILL_DIRS); do \
		name=$$(basename $$skill); \
		target=$(SKILLS_DIR)/$$name; \
		if [ -L "$$target" ]; then \
			rm "$$target"; \
		fi; \
		ln -s "$$(pwd)/$$name" "$$target"; \
		echo "Linked: $$name -> $$target"; \
	done

unlink:
	@for skill in $(SKILL_DIRS); do \
		name=$$(basename $$skill); \
		target=$(SKILLS_DIR)/$$name; \
		if [ -L "$$target" ]; then \
			rm "$$target"; \
			echo "Unlinked: $$target"; \
		fi; \
	done
