CLAUDE_SKILLS_DIR := $(HOME)/.claude/skills
AGENTS_SKILLS_DIR := $(HOME)/.agents/skills
SKILL_DIRS := $(shell find ./skills -maxdepth 2 -name 'SKILL.md' -exec dirname {} \;)
DIST := dist/clawdhub

.PHONY: link unlink build clean manifest bump hooks

link:
	@mkdir -p $(CLAUDE_SKILLS_DIR) $(AGENTS_SKILLS_DIR)
	@for skill in $(SKILL_DIRS); do \
		name=$$(basename $$skill); \
		for dir in $(CLAUDE_SKILLS_DIR) $(AGENTS_SKILLS_DIR); do \
			target=$$dir/$$name; \
			if [ -L "$$target" ]; then \
				rm "$$target"; \
			fi; \
			ln -s "$$(pwd)/skills/$$name" "$$target"; \
			echo "Linked: $$name -> $$target"; \
		done; \
	done

unlink:
	@for skill in $(SKILL_DIRS); do \
		name=$$(basename $$skill); \
		for dir in $(CLAUDE_SKILLS_DIR) $(AGENTS_SKILLS_DIR); do \
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
		for sub in references scripts; do \
			if [ -d "$$skill/$$sub" ]; then \
				cp -r $$skill/$$sub $$out/; \
			fi; \
		done; \
		echo "Built: $$out"; \
	done

clean:
	rm -rf dist

# Regenerate manifest.json (skill versions + file hashes) after changing skills/.
manifest:
	@bun run scripts/manifest.ts

# Bump a skill's metadata.version (and manifest.json): make bump SKILL=audit-website PART=minor
bump:
	@test -n "$(SKILL)" -a -n "$(PART)" || { echo "usage: make bump SKILL=<name> PART=patch|minor|major"; exit 1; }
	@bun run scripts/bump.ts $(SKILL) $(PART)

# Install the pre-commit hook that checks skill versions on staged changes.
hooks:
	@git config core.hooksPath .githooks
	@chmod +x .githooks/pre-commit
	@echo "core.hooksPath = .githooks (pre-commit checks skill versions)"
