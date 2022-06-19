function monitor(targetNode) {
  
    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationList, observer) {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(
                    function(currentValue, currentIndex, listObj) {
                        //console.log("Monitor child added: "+currentValue.nodeName);
                        searchAndReplaceSubTree(currentValue);
                    },
                    'myThisArg'
                );
            } else if(mutation.type === 'characterData') {
                console.log("Monitor CHARs @: "+mutation.target.nodeName);
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    searchAndReplaceSubTree(targetNode);
}

function nodeOfInterest(node) {
    if (node != null) {
        if (node.nodeType == Node.TEXT_NODE) {
            if (node.nodeValue != null) {
                if (node.nodeValue.length > 0) {
                    if (searchPattern.test(node.nodeValue)) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}


function searchAndReplaceSubTree(html) {
  var walker = document.createTreeWalker(html, NodeFilter.SHOW_TEXT, nodeOfInterest);
  var node;
  while (node = walker.nextNode()) {
     searchAndReplaceNode(node);
  }
}

function searchAndReplaceNode(node) {
     textReplacements.forEach ((value, key) => {
          node.nodeValue = node.nodeValue.replace(key, value);
      });
}

function monitorForImages(targetNode) {
    var observer = ImageObserver(targetNode);
    observer.on('added', function(imgs) {
        for(const img of imgs) {
            var replacement = imageReplacements.get(img.src);
            if (replacement) {
                img.src = replacement;
            }
        }
    });
}
