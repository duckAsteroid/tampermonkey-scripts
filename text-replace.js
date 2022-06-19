
/**
 * Performs text matching and replacement across a DOM tree. 
 * Monitors for DOM changes (e.g. ReactJS) and performs search
 * and replace on those nodes too.
 */
class TextReplacementMonitor {
    constructor(replacements) {
        this.textReplacements = new Map(replacements);
        var s = "\b("+Array.of(this.textReplacements.keys).join('|') + ")/b";
        this.testPattern = new RegExp(s, "g");
    }
    /**
     * Is the given DOM Node of any interest for text updates?
     * Is it TEXT_NODE, does it contain any content, and does that content
     * match any of our search phrases?
     * @param {Node} node 
     * @returns true if the node could be search/replaced
     */
    nodeOfInterest(node) {
        if (node != null) {
            if (node.nodeType == Node.TEXT_NODE) {
                if (node.nodeValue != null) {
                    if (node.nodeValue.length > 0) {
                        if (testPattern.test(node.nodeValue)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    
    /**
     * Walk all TEXT_NODES from a given root and perform our search/replace
     * @param {Node} root the root node to find text at or below
     */
    searchAndReplaceSubTree(root) {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, nodeOfInterest);
      var node;
      while (node = walker.nextNode()) {
         searchAndReplaceNode(node);
      }
    }
    
    /**
     * Do individual search and replace
     * @param {Node} node 
     */
    searchAndReplaceNode(node) {
         textReplacements.forEach ((value, key) => {
              node.nodeValue = node.nodeValue.replace(key, value);
          });
    }

    monitor(targetNode) {
  
        // Options for the observer (which mutations to observe)
        const config = { attributes: false, childList: true, subtree: true };
    
        // Callback function to execute when mutations are observed
        const callback = function(mutationList, observer) {
            // Use traditional 'for loops' for IE 11
            for(const mutation of mutationList) {
                if (mutation.type === 'childList') {
                    // process each added node
                    mutation.addedNodes.forEach(
                        function(currentValue, currentIndex, listObj) {
                            //console.log("Monitor child added: "+currentValue.nodeName);
                            searchAndReplaceSubTree(currentValue);
                        }
                    );
                }
            }
        };
    
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);
    
        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    
        // do an initial search and replace on the current content of the node
        searchAndReplaceSubTree(targetNode);
    }
}