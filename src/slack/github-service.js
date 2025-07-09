class GitHubService {
  constructor(app) {
    this.app = app;
  }

  async analyzePR(repoName, prNumber) {
    try {
      // Get the repository context
      const context = await this.getRepoContext(repoName);
      if (!context) {
        throw new Error(`Repository ${repoName} not found or not accessible`);
      }

      // Get PR details
      const { data: pr } = await context.octokit.pulls.get({
        owner: context.owner,
        repo: context.repo,
        pull_number: prNumber
      });

      // Get PR files
      const { data: files } = await context.octokit.pulls.listFiles({
        owner: context.owner,
        repo: context.repo,
        pull_number: prNumber
      });

      // Analyze the PR
      const analysis = {
        title: pr.title,
        state: pr.state,
        filesChanged: files.length,
        additions: files.reduce((sum, file) => sum + file.additions, 0),
        deletions: files.reduce((sum, file) => sum + file.deletions, 0),
        fileTypes: this.analyzeFileTypes(files),
        reviewStatus: pr.requested_reviewers?.length > 0 ? 'Review requested' : 'No reviews requested'
      };

      return this.formatAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing PR:', error);
      throw new Error(`Failed to analyze PR ${repoName}#${prNumber}: ${error.message}`);
    }
  }

  async listBranches(repoName) {
    try {
      const context = await this.getRepoContext(repoName);
      if (!context) {
        throw new Error(`Repository ${repoName} not found or not accessible`);
      }

      const { data: branches } = await context.octokit.repos.listBranches({
        owner: context.owner,
        repo: context.repo
      });

      return branches.map(branch => `• \`${branch.name}\` (${branch.commit.sha.substring(0, 7)})`);
    } catch (error) {
      console.error('Error listing branches:', error);
      throw new Error(`Failed to list branches for ${repoName}: ${error.message}`);
    }
  }

  async createPR(fromBranch, toBranch, title) {
    try {
      // For now, we'll create PR in the default repo
      const context = await this.getRepoContext('robin-relay-bot');
      if (!context) {
        throw new Error('Default repository not accessible');
      }

      const { data: pr } = await context.octokit.pulls.create({
        owner: context.owner,
        repo: context.repo,
        title: title,
        head: fromBranch,
        base: toBranch,
        body: `Pull request created via Slack bot\n\nFrom: \`${fromBranch}\`\nTo: \`${toBranch}\``
      });

      return {
        url: pr.html_url,
        number: pr.number,
        title: pr.title,
        state: pr.state
      };
    } catch (error) {
      console.error('Error creating PR:', error);
      throw new Error(`Failed to create PR: ${error.message}`);
    }
  }

  async editFile(filePath, content) {
    try {
      const context = await this.getRepoContext('robin-relay-bot');
      if (!context) {
        throw new Error('Default repository not accessible');
      }

      // Get current file content
      let currentContent = '';
      try {
        const { data: file } = await context.octokit.repos.getContent({
          owner: context.owner,
          repo: context.repo,
          path: filePath
        });
        currentContent = Buffer.from(file.content, 'base64').toString();
      } catch (error) {
        // File doesn't exist, that's okay for new files
      }

      // Create or update file
      const { data: result } = await context.octokit.repos.createOrUpdateFileContents({
        owner: context.owner,
        repo: context.repo,
        path: filePath,
        message: `Update ${filePath} via Slack bot`,
        content: Buffer.from(content).toString('base64'),
        sha: currentContent ? await this.getFileSHA(context, filePath) : undefined
      });

      return {
        status: 'updated',
        commit: result.commit.sha.substring(0, 7),
        url: result.content.html_url
      };
    } catch (error) {
      console.error('Error editing file:', error);
      throw new Error(`Failed to edit file ${filePath}: ${error.message}`);
    }
  }

  async getStatus(repoName) {
    try {
      const context = await this.getRepoContext(repoName);
      if (!context) {
        throw new Error(`Repository ${repoName} not found or not accessible`);
      }

      const { data: repo } = await context.octokit.repos.get({
        owner: context.owner,
        repo: context.repo
      });

      const { data: pulls } = await context.octokit.pulls.list({
        owner: context.owner,
        repo: context.repo,
        state: 'open'
      });

      return `📊 *Repository Status*\n\n` +
             `• **Name:** ${repo.full_name}\n` +
             `• **Description:** ${repo.description || 'No description'}\n` +
             `• **Language:** ${repo.language || 'Not specified'}\n` +
             `• **Stars:** ⭐ ${repo.stargazers_count}\n` +
             `• **Forks:** 🔀 ${repo.forks_count}\n` +
             `• **Open Issues:** 🐛 ${repo.open_issues_count}\n` +
             `• **Open PRs:** 🔄 ${pulls.length}\n` +
             `• **Last Updated:** ${new Date(repo.updated_at).toLocaleDateString()}`;
    } catch (error) {
      console.error('Error getting status:', error);
      throw new Error(`Failed to get status for ${repoName}: ${error.message}`);
    }
  }

  async runTests(repoName) {
    try {
      const context = await this.getRepoContext(repoName);
      if (!context) {
        throw new Error(`Repository ${repoName} not found or not accessible`);
      }

      // Check if there are test files
      const { data: contents } = await context.octokit.repos.getContent({
        owner: context.owner,
        repo: context.repo,
        path: ''
      });

      const testFiles = contents.filter(item => 
        item.type === 'file' && 
        (item.name.includes('test') || item.name.includes('spec') || item.name.includes('.test.'))
      );

      if (testFiles.length === 0) {
        return '🧪 *Test Results*\n\nNo test files found in the repository.';
      }

      return `🧪 *Test Results*\n\n` +
             `Found ${testFiles.length} test files:\n` +
             testFiles.map(file => `• \`${file.name}\``).join('\n') +
             `\n\n*Note:* This is a simulated test run. In a real implementation, you would execute the actual test suite.`;
    } catch (error) {
      console.error('Error running tests:', error);
      throw new Error(`Failed to run tests for ${repoName}: ${error.message}`);
    }
  }

  async runLint(repoName) {
    try {
      const context = await this.getRepoContext(repoName);
      if (!context) {
        throw new Error(`Repository ${repoName} not found or not accessible`);
      }

      // Check for linting configuration files
      const { data: contents } = await context.octokit.repos.getContent({
        owner: context.owner,
        repo: context.repo,
        path: ''
      });

      const lintConfigs = contents.filter(item => 
        item.type === 'file' && 
        (item.name.includes('eslint') || item.name.includes('prettier') || item.name.includes('.eslintrc') || item.name.includes('.prettierrc'))
      );

      if (lintConfigs.length === 0) {
        return '🔍 *Lint Results*\n\nNo linting configuration found. Consider adding ESLint or Prettier.';
      }

      return `🔍 *Lint Results*\n\n` +
             `Found ${lintConfigs.length} linting configurations:\n` +
             lintConfigs.map(file => `• \`${file.name}\``).join('\n') +
             `\n\n*Note:* This is a simulated lint run. In a real implementation, you would execute the actual linter.`;
    } catch (error) {
      console.error('Error running lint:', error);
      throw new Error(`Failed to run lint for ${repoName}: ${error.message}`);
    }
  }

  async securityCheck(repoName) {
    try {
      const context = await this.getRepoContext(repoName);
      if (!context) {
        throw new Error(`Repository ${repoName} not found or not accessible`);
      }

      // Check for security-related files
      const { data: contents } = await context.octokit.repos.getContent({
        owner: context.owner,
        repo: context.repo,
        path: ''
      });

      const securityFiles = contents.filter(item => 
        item.type === 'file' && 
        (item.name.includes('security') || item.name.includes('audit') || item.name.includes('SECURITY') || item.name.includes('package-lock.json'))
      );

      return `🔒 *Security Analysis*\n\n` +
             `Security files found: ${securityFiles.length}\n` +
             securityFiles.map(file => `• \`${file.name}\``).join('\n') +
             `\n\n*Recommendations:*\n` +
             `• Keep dependencies updated\n` +
             `• Use security scanning tools\n` +
             `• Enable Dependabot alerts\n` +
             `• Review code regularly`;
    } catch (error) {
      console.error('Error running security check:', error);
      throw new Error(`Failed to run security check for ${repoName}: ${error.message}`);
    }
  }

  async checkDependencies(repoName) {
    try {
      const context = await this.getRepoContext(repoName);
      if (!context) {
        throw new Error(`Repository ${repoName} not found or not accessible`);
      }

      // Check for package files
      const { data: contents } = await context.octokit.repos.getContent({
        owner: context.owner,
        repo: context.repo,
        path: ''
      });

      const packageFiles = contents.filter(item => 
        item.type === 'file' && 
        (item.name === 'package.json' || item.name === 'requirements.txt' || item.name === 'Pipfile' || item.name === 'Cargo.toml')
      );

      if (packageFiles.length === 0) {
        return '📦 *Dependency Check*\n\nNo package files found. This might not be a Node.js/Python/Rust project.';
      }

      return `📦 *Dependency Check*\n\n` +
             `Found ${packageFiles.length} package files:\n` +
             packageFiles.map(file => `• \`${file.name}\``).join('\n') +
             `\n\n*Recommendations:*\n` +
             `• Run \`npm audit\` for Node.js projects\n` +
             `• Use \`pip-audit\` for Python projects\n` +
             `• Enable automated dependency updates\n` +
             `• Monitor for security vulnerabilities`;
    } catch (error) {
      console.error('Error checking dependencies:', error);
      throw new Error(`Failed to check dependencies for ${repoName}: ${error.message}`);
    }
  }

  // Helper methods
  async getRepoContext(repoName) {
    try {
      // For now, we'll use the default installation
      // In a real implementation, you'd need to handle multiple installations
      const installations = await this.app.auth();
      if (!installations || installations.length === 0) {
        return null;
      }

      const installation = installations[0];
      const octokit = await this.app.auth(installation.id);

      // Parse repo name (owner/repo format)
      const [owner, repo] = repoName.includes('/') ? repoName.split('/') : [installation.account.login, repoName];

      return { octokit, owner, repo, installation };
    } catch (error) {
      console.error('Error getting repo context:', error);
      return null;
    }
  }

  async getFileSHA(context, filePath) {
    try {
      const { data: file } = await context.octokit.repos.getContent({
        owner: context.owner,
        repo: context.repo,
        path: filePath
      });
      return file.sha;
    } catch (error) {
      return undefined;
    }
  }

  analyzeFileTypes(files) {
    const types = {};
    files.forEach(file => {
      const ext = file.filename.split('.').pop();
      types[ext] = (types[ext] || 0) + 1;
    });
    return Object.entries(types).map(([ext, count]) => `${ext}: ${count}`).join(', ');
  }

  formatAnalysis(analysis) {
    return `📊 *PR Analysis*\n\n` +
           `• **Title:** ${analysis.title}\n` +
           `• **State:** ${analysis.state}\n` +
           `• **Files Changed:** ${analysis.filesChanged}\n` +
           `• **Additions:** +${analysis.additions}\n` +
           `• **Deletions:** -${analysis.deletions}\n` +
           `• **File Types:** ${analysis.fileTypes}\n` +
           `• **Review Status:** ${analysis.reviewStatus}`;
  }
}

module.exports = GitHubService; 